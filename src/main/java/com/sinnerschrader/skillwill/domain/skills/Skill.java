package com.sinnerschrader.skillwill.domain.skills;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;


/**
 * A skill known to the system including a list of suggestable skills
 *
 * @author torree
 */
public class Skill {

	private String description;

	private boolean hidden;

	private String name;

	@Id
	private String nameStem;

	private Set<String> subSkillNames;

	private List<SuggestionSkill> suggestions;

	@Version
	private Long version;

	public Skill() {
		this("", "", new ArrayList<>(), false, new HashSet<>());
	}

	public Skill(String name) {
		this(name, "", new ArrayList<>(), false, new HashSet<>());
	}

	public Skill(String name, String description, List<SuggestionSkill> suggestions, boolean hidden,
		Set<String> subSkillNames) {
		this.name = name;
		this.description = description;
		nameStem = SkillUtils.toStem(name);
		this.suggestions = suggestions;
		this.subSkillNames = subSkillNames;
		this.hidden = hidden;
	}

	public void addSubSkillName(String name) {
		subSkillNames.add(name);
	}

	public void deleteSuggestion(String name) {
		SuggestionSkill suggestion = getSuggestionByName(name);

		if (suggestion == null) {
			// no suggestion to rename
			return;
		}

		suggestions.remove(suggestion);
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		Skill skill = (Skill) o;
		return hidden == skill.hidden && Objects.equals(name, skill.name) && Objects.equals(nameStem, skill.nameStem)
			&& Objects.equals(suggestions, skill.suggestions) && Objects.equals(subSkillNames, skill.subSkillNames)
			&& Objects.equals(description, skill.description);
	}

	public String getDescription() {
		return description;
	}

	public String getName() {
		return name;
	}

	public Set<String> getSubSkillNames() {
		return subSkillNames;
	}

	private SuggestionSkill getSuggestionByName(String name) {
		return suggestions.stream().filter(s -> s.getName().equals(name)).findFirst().orElse(null);
	}

	public List<SuggestionSkill> getSuggestions() {
		return suggestions;
	}

	@Override
	public int hashCode() {

		return Objects.hash(name, nameStem, suggestions, subSkillNames, hidden, description);
	}

	public void incrementSuggestion(String name) {
		SuggestionSkill suggestion = getSuggestionByName(name);

		if (suggestion != null) {
			suggestion.incrementCount();
		} else {
			suggestions.add(new SuggestionSkill(name, 1));
		}
	}

	public boolean isHidden() {
		return hidden;
	}

	public void removeSubSkillName(String name) {
		subSkillNames.remove(name);
	}

	public void renameSubSkill(String oldName, String newName) {
		removeSubSkillName(oldName);
		addSubSkillName(newName);
	}

	public void renameSuggestion(String oldName, String newName) {
		SuggestionSkill suggestion = getSuggestionByName(oldName);

		if (suggestion == null) {
			// no suggestion to rename
			return;
		}

		suggestion.setName(newName);
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setHidden(boolean value) {
		hidden = value;
	}

	public void setName(String name) {
		this.name = name;
		nameStem = SkillUtils.toStem(name);
	}

	public void setSuggestions(List<SuggestionSkill> suggestions) {
		this.suggestions = suggestions;
	}

	public JSONObject toJSON() {
		JSONObject obj = new JSONObject();
		try {
			obj.put("name", name);
			obj.put("hidden", hidden);
			obj.put("subskills", new JSONArray(subSkillNames));
			obj.put("description", description);
		} catch (JSONException exception) {
			throw new RuntimeException(exception);
		}
		return obj;
	}

}
