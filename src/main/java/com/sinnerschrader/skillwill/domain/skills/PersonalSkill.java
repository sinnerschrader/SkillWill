package com.sinnerschrader.skillwill.domain.skills;

import org.json.JSONObject;
import org.springframework.data.annotation.Id;

/**
 * A skill owned by a person
 * includes name, skill level and will level
 *
 * @author torree
 */
public class PersonalSkill {

  @Id
  private String name;
  private int skillLevel;
  private int willLevel;
  private boolean hidden;

  public PersonalSkill(String name, int skillLevel, int willLevel, boolean hidden) {
    this.name = name;
    this.skillLevel = skillLevel;
    this.willLevel = willLevel;
    this.hidden = hidden;
  }

  public String getName() {
    return this.name;
  }

  public int getSkillLevel() {
    return skillLevel;
  }

  public void setSkillLevel(int skillLevel) {
    this.skillLevel = skillLevel;
  }

  public int getWillLevel() {
    return willLevel;
  }

  public void setWillLevel(int willLevel) {
    this.willLevel = willLevel;
  }

  public void setHidden(Boolean hidden) {
    this.hidden = hidden;
  }

  public boolean isHidden() {
    return this.hidden;
  }

  public JSONObject toJSON() {
    JSONObject o = new JSONObject();
    o.put("name", this.name);
    o.put("skillLevel", this.skillLevel);
    o.put("willLevel", this.willLevel);
    return o;
  }

}
