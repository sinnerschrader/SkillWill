package com.sinnerschrader.skillwill.domain.skills;

import org.springframework.util.StringUtils;


public class SkillUtils {

	public static String sanitizeName(String name) {
		return StringUtils.isEmpty(name) ? "" : name.trim();
	}

	public static String toStem(String name) {
		if (name == null) {
			throw new IllegalArgumentException("cannot generate stem from null");
		}
		return name.replaceAll("[^A-Za-z0-9+]", "").toUpperCase();
	}

}
