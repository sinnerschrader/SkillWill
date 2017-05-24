package com.sinnerschrader.skillwill.domain.skills;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.json.JSONArray;
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
  private Set<String> subSkillNames;
  private boolean hidden;

  @Version
  private Long version;

  public KnownSkill(String name, String iconDescriptor, List<SuggestionSkill> suggestions, Boolean hidden, Set<String> subSkillNames) {
    this.name = name;
    this.nameStem = SkillStemUtils.nameToStem(name);
    this.iconDescriptor = iconDescriptor;
    this.suggestions = suggestions;
    this.subSkillNames = subSkillNames;
    this.hidden = hidden;
  }

  public KnownSkill(String name, String iconDescriptor) {
    this(name, iconDescriptor, new ArrayList<>(), false, new HashSet<>());
  }

  public KnownSkill() {
    this("", "", new ArrayList<>(), false, new HashSet<>());
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

  public Set<String> getSubSkillNames() {
    return this.subSkillNames;
  }

  public void addSubSkillName(String name) {
    this.subSkillNames.add(name);
  }

  public void removeSubSkillName(String name) {
    this.subSkillNames.remove(name);
  }

  public void setSubSkillNames(Collection<String> names) {
    this.subSkillNames = new HashSet<>(names);
  }

  public void renameSubSkillName(String oldName, String newName) {
    this.removeSubSkillName(oldName);
    this.addSubSkillName(newName);
  }

  public Boolean isHidden() {
    return this.hidden;
  }

  public void setHidden(Boolean value) {
    this.hidden = value;
  }

  public JSONObject toJSON() {
    JSONObject obj = new JSONObject();
    obj.put("name", this.name);
    obj.put("iconDescriptor", this.iconDescriptor);
    obj.put("subskills", new JSONArray(this.subSkillNames));
    return obj;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }

    KnownSkill that = (KnownSkill) o;

    if (hidden != that.hidden) {
      return false;
    }
    if (!name.equals(that.name)) {
      return false;
    }
    if (!nameStem.equals(that.nameStem)) {
      return false;
    }
    if (iconDescriptor != null ? !iconDescriptor.equals(that.iconDescriptor) : that.iconDescriptor != null) {
      return false;
    }
    if (suggestions != null ? !suggestions.equals(that.suggestions) : that.suggestions != null) {
      return false;
    }
    return subSkillNames != null ? subSkillNames.equals(that.subSkillNames) : that.subSkillNames == null;
  }

  @Override
  public int hashCode() {
    int result = name.hashCode();
    result = 31 * result + nameStem.hashCode();
    result = 31 * result + (iconDescriptor != null ? iconDescriptor.hashCode() : 0);
    result = 31 * result + (suggestions != null ? suggestions.hashCode() : 0);
    result = 31 * result + (subSkillNames != null ? subSkillNames.hashCode() : 0);
    result = 31 * result + (hidden ? 1 : 0);
    return result;
  }
}
