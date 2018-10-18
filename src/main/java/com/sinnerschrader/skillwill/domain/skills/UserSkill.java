package com.sinnerschrader.skillwill.domain.skills;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;


/**
 * A skill owned by a person includes name, skill level and will level
 *
 * @author torree
 */
public class UserSkill {

	private boolean hidden;

	private boolean mentor;

	@Id
	private String name;

	private int skillLevel;

	private int willLevel;

	public UserSkill(String name, int skillLevel, int willLevel, boolean hidden, boolean mentor) {
		this.name = name;
		this.skillLevel = skillLevel;
		this.willLevel = willLevel;
		this.hidden = hidden;
		this.mentor = mentor;
	}

	public String getName() {
		return name;
	}

	public int getSkillLevel() {
		return skillLevel;
	}

	public int getWillLevel() {
		return willLevel;
	}

	public boolean isHidden() {
		return hidden;
	}

	public boolean isMentor() {
		return mentor;
	}

	public void setHidden(boolean hidden) {
		this.hidden = hidden;
	}

	public void setMentor(boolean mentor) {
		this.mentor = mentor;
	}

	public void setSkillLevel(int skillLevel) {
		this.skillLevel = skillLevel;
	}

	public void setWillLevel(int willLevel) {
		this.willLevel = willLevel;
	}

	public JSONObject toJSON() {
		var json = new JSONObject();
		try {
			json.put("name", name);
			json.put("skillLevel", skillLevel);
			json.put("willLevel", willLevel);
			json.put("mentor", mentor);
		} catch (JSONException exception) {
			throw new RuntimeException(exception);
		}
		return json;
	}

}
