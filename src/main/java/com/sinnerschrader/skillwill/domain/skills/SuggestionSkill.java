package com.sinnerschrader.skillwill.domain.skills;

/**
 * A suggestable skill used by Skill
 *
 * @author torree
 */
public class SuggestionSkill {

  private String name;

  private int count;

  public SuggestionSkill(String name, int count) {
    this.name = name;
    this.count = count;
  }

  public SuggestionSkill(String name) {
    this(name, 0);
  }

  public SuggestionSkill() {
    this(null, 0);
  }

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public int getCount() {
    return this.count;
  }

  public void setCount(int count) {
    this.count = count;
  }

  public void incrementCount() {
    this.count += 1;
  }

  public void incrementCount(int add) {
    this.count += add;
  }

}
