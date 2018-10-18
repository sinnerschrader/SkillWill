package com.sinnerschrader.skillwill.session;

import java.util.Base64;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;


/**
 * Sesion information
 *
 * @author torree
 */
public class Session {

	private final String mail;
	@Id
	private final String token;

	@Version
	private Long version;

	public Session(String token) {
		this.token = token;
		mail = getMailFromToken(token);
	}

	public String getMail() {
		return mail;
	}

	private String getMailFromToken(String token) {
		// Oauth2 token: fooo|bar|baz -> foo = base64 encoded user mail
		try {
			return new String(Base64.getDecoder().decode(token.split("\\|")[0]));
		} catch (NullPointerException e) {
			return null;
		}
	}

	public String getToken() {
		return token;
	}

}
