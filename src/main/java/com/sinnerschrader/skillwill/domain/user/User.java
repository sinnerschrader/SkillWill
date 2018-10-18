package com.sinnerschrader.skillwill.domain.user;

import com.sinnerschrader.skillwill.domain.skills.Skill;
import com.sinnerschrader.skillwill.domain.skills.UserSkill;
import com.sinnerschrader.skillwill.exceptions.SkillNotFoundException;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.annotation.Version;


/**
 * Class holding all information about a person
 *
 * @author torree
 */
public class User {

	@Transient
	private FitnessScore fitnessScore;

	@Id
	private String id;

	// LDAP Details will be updated regularly
	private UserLdapDetails ldapDetails;

	private String ldapDN;

	private List<UserSkill> skills;

	@Version
	private Long version;

	public User(String id) {
		this.id = id;
		skills = new ArrayList<>();
		ldapDetails = null;
		fitnessScore = null;
		ldapDN = null;
	}

	public void addUpdateSkill(String name, int skillLevel, int willLevel, boolean hidden, boolean mentor) {
		try {
			removeSkill(name);
		} catch (SkillNotFoundException e) {
			// user doesn't have skill yet -> add new skill
		}
		skills.add(new UserSkill(name, skillLevel, willLevel, hidden, mentor));
	}

	public double getFitnessScoreValue() {
		if (fitnessScore == null) {
			throw new IllegalStateException("no fitness score set");
		}

		return fitnessScore.getValue();
	}

	public String getId() {
		return id;
	}

	public UserLdapDetails getLdapDetails() {
		return ldapDetails;
	}

	public String getLdapDN() {
		return ldapDN;
	}

	public UserSkill getSkill(String name, boolean excludeHidden) {
		return skills.stream().filter(s -> s.getName().equals(name)).filter(s -> !excludeHidden || !s.isHidden())
			.findFirst().orElse(null);
	}

	public List<UserSkill> getSkills(boolean excludeHidden) {
		return skills.stream().filter(skill -> !excludeHidden || !skill.isHidden()).collect(Collectors.toList());
	}

	public boolean hasSkill(String skill) {
		return getSkill(skill, true) != null;
	}

	public void removeSkill(String name) throws SkillNotFoundException {
		var toRemove = skills.stream().filter(s -> s.getName().equals(name)).findAny()
			.orElseThrow(() -> new SkillNotFoundException("user does not have skill"));
		skills.remove(toRemove);
	}

	public void setFitnessScore(Collection<Skill> searchedSkills, FitnessScoreProperties props) {
		fitnessScore = new FitnessScore(this, searchedSkills, props);
	}

	public void setLdapDetails(UserLdapDetails ldapDetails) {
		this.ldapDetails = ldapDetails;
	}

	public void setLdapDN(String ldapDN) {
		this.ldapDN = ldapDN;
	}

	public JSONObject toJSON() {
		try {
			var json = new JSONObject();
			json.put("id", id);

			if (ldapDetails != null) {
				json.put("firstName", ldapDetails.getFirstName());
				json.put("lastName", ldapDetails.getLastName());
				json.put("mail", ldapDetails.getMail());
				json.put("phone", ldapDetails.getPhone());
				json.put("location", ldapDetails.getLocation());
				json.put("title", ldapDetails.getTitle());
				json.put("company", ldapDetails.getCompany());
				json.put("role", ldapDetails.getRole());
			}

			if (fitnessScore != null) {
				json.put("fitness", fitnessScore.getValue());
			}

			var skillsArr = new JSONArray();
			skills.stream().filter(s -> !s.isHidden()).sorted(Comparator.comparing(UserSkill::getName))
				.map(UserSkill::toJSON).forEach(skillsArr::put);

			json.put("skills", skillsArr);
			return json;
		} catch (JSONException exception) {
			throw new RuntimeException(exception);
		}
	}

}
