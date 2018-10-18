package com.sinnerschrader.skillwill.domain.skills;

import java.util.Map;
import java.util.Set;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.util.CollectionUtils;


public class SkillSearchResult {

	private final Map<String, Skill> mapped;

	Set<String> unmapped;

	public SkillSearchResult(Map<String, Skill> mapped, Set<String> unmapped) {
		this.mapped = mapped;
		this.unmapped = unmapped;
	}

	public Map<String, Skill> getMapped() {
		return mapped;
	}

	public boolean isInputEmpty() {
		return CollectionUtils.isEmpty(mapped) && CollectionUtils.isEmpty(unmapped);
	}

	public Set<Skill> mappedSkills() {
		return Set.copyOf(mapped.values());
	}

	public JSONArray mappingJson() {
		var array = new JSONArray();
		mapped.forEach((key, value) -> {
			var mappingObject = new JSONObject();
			try {
				mappingObject.put("input", key);
				mappingObject.put("found", value.getName());
			} catch (JSONException exception) {
				throw new RuntimeException(exception);
			}
			array.put(mappingObject);
		});
		return array;
	}

}
