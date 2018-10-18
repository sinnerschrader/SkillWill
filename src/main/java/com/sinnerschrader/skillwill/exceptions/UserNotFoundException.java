package com.sinnerschrader.skillwill.exceptions;

public class UserNotFoundException extends IllegalArgumentException {

	public UserNotFoundException(String message) {
		super(message);
	}

}
