package com.sinnerschrader.skillwill.domain.skills;

/**
 * Word Stemming (actually truncating) to make the person search more
 * robust
 *
 * The usual linguistic algorithms do not really work in this case since skills are
 * arbitarily chosen names or acronyms and proper stemming would require a fixed vocabulary to map
 * the names to.
 *
 * This approach is more of a hash function: remove all non-alphanumeric chars from the input and
 * make it all caps -> common variants of skills (e.g. "JavaScript", "Javascript",
 * "Java Script", "Java-Script") will be mapped to "JAVASCRIPT"
 */
public class SkillStemUtils {

  public static String nameToStem(String name) {
    if (name == null) {
      throw new IllegalArgumentException("cannot generate stem from null");
    }
    return name.replaceAll("[^A-Za-z0-9+]", "").toUpperCase();
  }

}
