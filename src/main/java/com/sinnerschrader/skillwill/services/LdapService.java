package com.sinnerschrader.skillwill.services;

import com.sinnerschrader.skillwill.domain.user.Role;
import com.sinnerschrader.skillwill.domain.user.User;
import com.sinnerschrader.skillwill.domain.user.UserLdapDetailsFactory;
import com.sinnerschrader.skillwill.misc.EmbeddedLdap;
import com.sinnerschrader.skillwill.repositories.UserRepository;
import com.unboundid.ldap.sdk.LDAPConnection;
import com.unboundid.ldap.sdk.LDAPException;
import com.unboundid.ldap.sdk.SearchRequest;
import com.unboundid.ldap.sdk.SearchResultEntry;
import com.unboundid.ldap.sdk.SearchScope;
import com.unboundid.ldap.sdk.SimpleBindRequest;
import com.unboundid.util.ssl.SSLUtil;
import com.unboundid.util.ssl.TrustAllTrustManager;

import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextStartedEvent;
import org.springframework.context.event.ContextStoppedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;


/**
 * Service handling LDAP auth and data retrieval
 *
 * @author torree
 */
@Service
@EnableRetry
public class LdapService {

	private static LDAPConnection ldapConnection;
	private static final Logger logger = LoggerFactory.getLogger(LdapService.class);

	private final EmbeddedLdap embeddedLdap;

	@Value("${ldapAdminGroupDN}")
	private String ldapAdminGroupDN;

	@Value("${ldapEmbedded}")
	private boolean ldapEmbedded;

	@Value("${ldapLookupBaseDN}")
	private String ldapLookupBaseDN;

	@Value("${ldapLookupPassword}")
	private String ldapLookupPassword;

	@Value("${ldapLookupUser}")
	private String ldapLookupUser;

	@Value("${ldapPort}")
	private int ldapPort;

	@Value("${ldapSsl}")
	private boolean ldapSsl;

	@Value("${ldapUrl}")
	private String ldapUrl;

	@Value("${ldapUserBaseDN}")
	private String ldapUserBaseDN;

	@Value("${ldapUserBaseOUs}")
	private String ldapUserBaseOUs;

	private final UserLdapDetailsFactory userLdapDetailsFactory;

	private final UserRepository userRepo;

	@Autowired
	public LdapService(UserRepository userRepo, EmbeddedLdap embeddedLdap,
		UserLdapDetailsFactory userLdapDetailsFactory) {
		this.userRepo = userRepo;
		this.embeddedLdap = embeddedLdap;
		this.userLdapDetailsFactory = userLdapDetailsFactory;
	}

	private List<String> allOUs() {
		return Arrays.stream(ldapUserBaseOUs.split("\\|")).map(pair -> pair.split(",")[0]).collect(Collectors.toList());
	}

	private void bindAsTechnicalUser() throws LDAPException {
		ldapConnection.bind(new SimpleBindRequest("cn=" + ldapLookupUser + "," + ldapLookupBaseDN, ldapLookupPassword));
	}

	@EventListener(ContextStoppedEvent.class)
	public void closeConnection() {
		if (ldapConnection == null || !ldapConnection.isConnected()) {
			logger.debug("Failed to disconnect LDAP: No open connection");
		}
		ldapConnection.close();
	}

	public User createUserByMail(String mail) {
		ensureConnection();
		try {
			bindAsTechnicalUser();
		} catch (LDAPException e) {
			logger.error("Failed to bind ldap as tech user", e);
		}

		var ldapEntry = getEntryByMail(mail);
		if (ldapEntry == null) {
			logger.warn("Failed to sync user {} with LDAP: no result", mail);
			return null;
		}

		String dn = null;
		try {
			dn = ldapEntry.getParentDNString();
		} catch (LDAPException e) {
			e.printStackTrace();
		}

		var id = ldapEntry.getAttributeValue("uid");
		var role = getAdminIds().contains(id) ? Role.ADMIN : Role.USER;
		var ldapDetails = userLdapDetailsFactory.create(ldapEntry, role);

		var newUser = new User(id);
		newUser.setLdapDN(dn);
		newUser.setLdapDetails(ldapDetails);

		return newUser;
	}

	private void ensureConnection() {
		if (ldapConnection == null || !ldapConnection.isConnected()) {
			openConnection();
		}
	}

	private Set<String> getAdminIds() {
		ensureConnection();
		try {
			bindAsTechnicalUser();
			var ldapRequest = new SearchRequest(ldapAdminGroupDN, SearchScope.SUB, "(memberUid=*)");
			var adminGroupResult = ldapConnection.search(ldapRequest).getSearchEntries();

			if (adminGroupResult.size() != 1) {
				throw new IllegalStateException("Failed to find unique admin ldap group");
			}

			return Set.of(adminGroupResult.get(0).getAttributeValues("memberUid"));
		} catch (LDAPException e) {
			return Collections.emptySet();
		}
	}

	private SearchResultEntry getEntry(String filter) {
		try {
			for (String ou : allOUs()) {
				var dn = ldapUserBaseDN.replace("{}", ou);
				var ldapRequest = new SearchRequest(dn, SearchScope.SUB, filter);
				var ldapResult = ldapConnection.search(ldapRequest);

				if (ldapResult.getEntryCount() > 0) {
					return ldapResult.getSearchEntries().get(0);
				}
			}

			return null;
		} catch (LDAPException e) {
			return null;
		}
	}

	private SearchResultEntry getEntryById(String id) {
		return getEntry("(uid=" + id + ")");
	}

	private SearchResultEntry getEntryByMail(String mail) {
		return getEntry("(mail=" + mail + ")");
	}

	@EventListener(ContextStartedEvent.class)
	public void openConnection() {
		tryStartEmbeddedLdap();
		try {
			if (ldapSsl) {
				var sslUtil = new SSLUtil(new TrustAllTrustManager());
				var sslSocketFactory = sslUtil.createSSLSocketFactory();
				ldapConnection = new LDAPConnection(sslSocketFactory);
			} else {
				ldapConnection = new LDAPConnection();
			}
			ldapConnection.connect(ldapUrl, ldapPort);
			logger.info("Successfully connected to LDAP");
		} catch (LDAPException | GeneralSecurityException e) {
			logger.error("Failed to connect to LDAP", e);
		}
	}

	@Retryable(include = OptimisticLockingFailureException.class, maxAttempts = 10)
	public User syncUser(User user) {
		return syncUsers(List.of(user), false).get(0);
	}

	public List<User> syncUsers(List<User> users, boolean forceUpdate) {
		ensureConnection();

		try {
			bindAsTechnicalUser();
		} catch (LDAPException e) {
			logger.error("Failed to sync users, LDAP error");
			return users;
		}

		var updated = new ArrayList<User>();
		var adminIds = getAdminIds();

		for (User user : users) {
			SearchRequest ldapRequest;
			SearchResultEntry ldapEntry;
			var isRemoved = false;

			try {
				// user does not need to update, irgnore
				if (!forceUpdate && user.getLdapDetails() != null) {
					updated.add(user);
					continue;
				}

				if (StringUtils.isEmpty(user.getLdapDN())) {
					ldapEntry = getEntryById(user.getId());
					if (ldapEntry != null) {
						user.setLdapDN(ldapEntry.getParentDNString());
					}
				} else {
					ldapRequest = new SearchRequest(user.getLdapDN(), SearchScope.SUB, "(uid=" + user.getId() + ")");
					var entries = ldapConnection.search(ldapRequest).getSearchEntries();
					ldapEntry = entries.size() < 1 ? null : entries.get(0);
				}

				if (ldapEntry == null) {
					logger.warn("Failed to sync user {}: Not found in LDAP, will remove", user.getId());
					userRepo.delete(user);
					isRemoved = true;
				} else {
					var role = adminIds.contains(user.getId()) ? Role.ADMIN : Role.USER;
					user.setLdapDetails(userLdapDetailsFactory.create(ldapEntry, role));
				}
			} catch (LDAPException e) {
				logger.error("Failed to sync user {}: LDAP error", user.getId());
			}

			if (!isRemoved) {
				updated.add(user);
			}
		}

		userRepo.saveAll(updated);

		logger.info("Successfully synced {} users with LDAP", updated.size());
		return updated;
	}

	private void tryStartEmbeddedLdap() {
		if (!ldapEmbedded) {
			return;
		}

		try {
			embeddedLdap.startup();
		} catch (LDAPException e) {
			logger.error("Failed to start embedded LDAP");
		}
	}

}
