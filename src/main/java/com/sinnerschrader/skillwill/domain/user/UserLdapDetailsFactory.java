package com.sinnerschrader.skillwill.domain.user;

import com.unboundid.ldap.sdk.LDAPException;
import com.unboundid.ldap.sdk.SearchResultEntry;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;


@Component
public class UserLdapDetailsFactory {

	private final static Logger logger = LoggerFactory.getLogger(UserLdapDetailsFactory.class);

	@Value("${ldapUserBaseOUs}")
	private String ldapUserBaseOUs;

	public UserLdapDetails create(SearchResultEntry entry, Role role) {
		String company = "";
		try {
			company = getCompanyByDn(entry.getParentDNString());
		} catch (LDAPException e) {
			logger.warn("Failed to extract company from entry");
		}

		return new UserLdapDetails(entry.getAttributeValue("givenName"), entry.getAttributeValue("sn"),
			entry.getAttributeValue("mail"), entry.getAttributeValue("telephoneNumber"), entry.getAttributeValue("l"),
			entry.getAttributeValue("title"), company, role);
	}

	private String getCompanyByDn(String dn) {
		Map<String, String> map = new HashMap<>();
		Arrays.stream(ldapUserBaseOUs.split("\\|")).forEach(pair -> {
			String[] split = pair.split(",");
			map.put(split[0], split[1]);
		});

		for (String x : dn.split(",")) {
			String[] split = x.split("=");
			if (split[0].equals("ou") && !StringUtils.isEmpty(map.get(split[1]))) {
				return map.get(split[1]);
			}
		}

		return null;
	}

}
