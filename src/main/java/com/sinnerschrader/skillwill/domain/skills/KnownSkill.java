package com.sinnerschrader.skillwill.domain.skills;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;

/**
 * A skill known to the system including a list of suggestable skills
 *
 * @author torree
 */
public class KnownSkill {

  private String name;
  @Id
  private String nameStem;
  private String iconDescriptor;
  private List<SuggestionSkill> suggestions;

  @Version
  private Long version;

  public KnownSkill(String name, String iconDescriptor, List<SuggestionSkill> suggestions) {
    this.name = name;
    this.nameStem = SkillStemUtils.nameToStem(name);
    this.iconDescriptor = iconDescriptor;
    this.suggestions = suggestions;
  }

  public KnownSkill(String name, String iconDescriptor) {
    this(name, iconDescriptor, new ArrayList<>());
  }

  public KnownSkill() {
    this("", "", null);
  }

  public String getName() {
    return this.name;
  }

  public void setName(String name) {
    this.name = name;
    this.nameStem = SkillStemUtils.nameToStem(name);
  }

  public String getNameStem() {
    return this.nameStem;
  }

  public String getIconDescriptor() {
    return this.iconDescriptor;
  }

  public void setIconDescriptor(String iconDescriptor) {
    this.iconDescriptor = iconDescriptor;
  }

  public List<SuggestionSkill> getSuggestions() {
    return this.suggestions;
  }

  public void setSuggestions(List<SuggestionSkill> suggestions) {
    this.suggestions = suggestions;
  }

  private SuggestionSkill getSuggestionByName(String name) {
    return this.suggestions.stream()
        .filter(s -> s.getName().equals(name))
        .findFirst()
        .orElse(null);
  }

  public void renameSuggestion(String oldName, String newName) {
    SuggestionSkill suggestion = getSuggestionByName(oldName);

    if (suggestion == null) {
      // no suggestion to rename
      return;
    }

    suggestion.setName(newName);
  }

  public void incrementSuggestion(String name) {
    SuggestionSkill suggestion = getSuggestionByName(name);

    if (suggestion != null) {
      suggestion.incrementCount();
    } else {
      suggestions.add(new SuggestionSkill(name, 1));
    }
  }

  public void deleteSuggestion(String name) {
    SuggestionSkill suggestion = getSuggestionByName(name);

    if (suggestion == null) {
      // no suggestion to rename
      return;
    }

    this.suggestions.remove(suggestion);
  }

  public JSONObject toJSON() {
    JSONObject obj = new JSONObject();
    obj.put("name", this.name);
    obj.put("iconDescriptor", this.iconDescriptor);
    return obj;
  }

  @Override
  public boolean equals(Object o) {
    if (!(o instanceof KnownSkill)) {
      return false;
    }

    if (((KnownSkill) o).getNameStem() == null || this.getNameStem() == null) {
      throw new IllegalStateException("KnownSkill's nameStem is null.");
    }

    return ((KnownSkill) o).getNameStem().equals(this.getNameStem());
  }

  @Override
  public int hashCode() {
    return this.getNameStem().hashCode();
  }

}
