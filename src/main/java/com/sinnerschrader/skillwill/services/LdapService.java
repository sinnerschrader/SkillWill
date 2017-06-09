package com.sinnerschrader.skillwill.services;


import com.sinnerschrader.skillwill.domain.person.Person;
import com.sinnerschrader.skillwill.domain.person.PersonalLdapDetails;
import com.sinnerschrader.skillwill.misc.EmbeddedLdap;
import com.sinnerschrader.skillwill.repositories.PersonRepository;
import com.unboundid.ldap.sdk.BindRequest;
import com.unboundid.ldap.sdk.BindResult;
import com.unboundid.ldap.sdk.LDAPBindException;
import com.unboundid.ldap.sdk.LDAPConnection;
import com.unboundid.ldap.sdk.LDAPException;
import com.unboundid.ldap.sdk.ResultCode;
import com.unboundid.ldap.sdk.SearchRequest;
import com.unboundid.ldap.sdk.SearchResult;
import com.unboundid.ldap.sdk.SearchResultEntry;
import com.unboundid.ldap.sdk.SearchScope;
import com.unboundid.ldap.sdk.SimpleBindRequest;
import com.unboundid.util.ssl.SSLUtil;
import com.unboundid.util.ssl.TrustAllTrustManager;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.net.ssl.SSLSocketFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;

/**
 * Service handling LDAP auth and data retrieval
 *
 * @author torree
 */
@Service
@EnableRetry
public class LdapService {

  private static final Logger logger = LoggerFactory.getLogger(LdapService.class);
  private static LDAPConnection ldapConnection;

  @Value("${ldapUrl}")
  private String ldapUrl;

  @Value("${ldapPort}")
  private int ldapPort;

  @Value("${ldapAuthBaseDN}")
  private String ldapAuthBaseDN;

  @Value("${ldapLookupBaseDN}")
  private String ldapLookupBaseDN;

  @Value("${ldapEmbeded}")
  private boolean ldapEmbeded;

  @Value("${ldapSsl}")
  private boolean ldapSsl;

  @Value("${ldapLookupUser}")
  private String ldapLookupUser;

  @Value("${ldapLookupPassword}")
  private String ldapLookupPassword;

  @Autowired
  private PersonRepository personRepo;

  @Autowired
  private EmbeddedLdap ldap;

  @PostConstruct
  private void setup() {
    if (ldapEmbeded) {
      try {
        ldap.startup();
      } catch (LDAPException | IOException e) {
        logger.error("Failed to start embedded LDAP");
      }
    }

    try {
      if (ldapSsl) {
        SSLUtil sslUtil = new SSLUtil(new TrustAllTrustManager());
        SSLSocketFactory sslSocketFactory = sslUtil.createSSLSocketFactory();
        ldapConnection = new LDAPConnection(sslSocketFactory);
      } else {
        ldapConnection = new LDAPConnection();
      }
      ldapConnection.connect(ldapUrl, ldapPort);
    } catch (LDAPException | GeneralSecurityException e) {
      logger.error("Failed to connect to LDAP", e);
    }

  }

  @PreDestroy
  private void closeConnection() {
    if (ldapConnection != null) {
      ldapConnection.close();
    }
  }

  @Retryable(include = OptimisticLockingFailureException.class, maxAttempts = 10)
  public void syncUser(Person person) {
    List<Person> lst = new ArrayList<>();
    lst.add(person);
    syncUsers(lst, false);
  }

  public List<Person> syncUsers(List<Person> persons, boolean forceUpdate) {
    try {
      ldapConnection.bind(new SimpleBindRequest("cn=" + ldapLookupUser + "," + ldapLookupBaseDN, ldapLookupPassword));
    } catch (LDAPException e) {
      logger.error("Failed to sync users: bind exception", e);
    }

    List<Person> updatablePersons;
    List<Person> returnPersons = new ArrayList<>(persons);

    if (forceUpdate) {
      updatablePersons = persons;
    } else {
      updatablePersons = persons.stream()
          .filter(p -> p.getLdapDetails() == null)
          .collect(Collectors.toList());
    }

    if (updatablePersons.isEmpty()) {
      return persons;
    }

    logger.info("Starting LDAP sync for users: {}",
        persons.stream().map(Person::getId).collect(Collectors.joining(", ")));

    try {
      // searchString is an LDAP expression, e.g. "(|(uid=foobar)(uid=bazfoo))"
      String searchString = "(|" + persons.stream()
          .map(p -> "(uid=" + p.getId() + ")")
          .collect(Collectors.joining("")) + ")";
      SearchResult res = ldapConnection
          .search(new SearchRequest(ldapAuthBaseDN, SearchScope.SUB, searchString));
      for (Person person : updatablePersons) {
        SearchResultEntry entry = res.getSearchEntry("uid=" + person.getId() + "," + ldapAuthBaseDN);
        try {
          PersonalLdapDetails newDetails = new PersonalLdapDetails(
              entry.getAttributeValue("givenName"),
              entry.getAttributeValue("sn"),
              entry.getAttributeValue("mail"),
              entry.getAttributeValue("telephoneNumber"),
              entry.getAttributeValue("l"),
              entry.getAttributeValue("title")
          );
          if (!newDetails.equals(person.getLdapDetails())) {
            person.setLdapDetails(newDetails);
            personRepo.save(person);
          }
        } catch (NullPointerException e) {
          logger.info("Failed to sync user {}: will remove from DB", person.getId());
          personRepo.delete(person);
          returnPersons.remove(person);
        }
      }
    } catch (LDAPException e) {
      logger.error("Failed to sync with LDAP: LDAP error", e);
    }

    return returnPersons;
  }

  public boolean canAuthenticate(String username, String password) {
    try {
      BindRequest bindRequest = new SimpleBindRequest("uid=" + username + "," + ldapAuthBaseDN, password);
      BindResult bindResult = ldapConnection.bind(bindRequest);
      return bindResult.getResultCode().equals(ResultCode.SUCCESS);
    } catch (LDAPBindException e) {
      return false;
    } catch (LDAPException e) {
      logger.error("Failed to authenticate: LDAP error", e);
    }
    return false;
  }

}
