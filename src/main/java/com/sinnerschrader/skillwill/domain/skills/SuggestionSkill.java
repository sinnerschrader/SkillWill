package com.sinnerschrader.skillwill.domain.skills;

/**
 * A suggestable skill used by Skill
 *
 * @author torree
 */
public class SuggestionSkill {

	private int count;

	private String name;

	public SuggestionSkill() {
		this(null, 0);
	}

	public SuggestionSkill(String name) {
		this(name, 0);
	}

	public SuggestionSkill(String name, int count) {
		this.name = name;
		this.count = count;
	}

	public int getCount() {
		return count;
	}

	public String getName() {
		return name;
	}

	public void incrementCount() {
		count += 1;
	}

	public void incrementCount(int add) {
		count += add;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public void setName(String name) {
		this.name = name;
	}

}
