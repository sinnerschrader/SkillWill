package com.sinnerschrader.skillwill.mock;

import com.sinnerschrader.skillwill.domain.skills.Skill;
import com.sinnerschrader.skillwill.domain.user.User;
import com.sinnerschrader.skillwill.jobs.LdapSyncJob;
import com.sinnerschrader.skillwill.repositories.SkillRepository;
import com.sinnerschrader.skillwill.repositories.UserRepository;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import org.json.JSONArray;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationStartedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;


/**
 * Reads Mock Data from files specified in application.properties and inserts it into DB. Handle with care, as this
 * could delete all your data.
 *
 * @author torree
 */
@Component
public class MockData {

	private static final Logger logger = LoggerFactory.getLogger(MockData.class);

	@Value("${mockInit}")
	private boolean initmock;

	private final LdapSyncJob ldapSyncJob;

	@Value("${mockPersonsFilePath}")
	private String personsPath;

	private final SkillRepository skillRepo;

	@Value("${mockSkillFilePath}")
	private String skillsPath;

	private final UserRepository userRepo;

	@Autowired
	public MockData(SkillRepository skillRepo, UserRepository userRepo, LdapSyncJob ldapSyncJob) {
		this.skillRepo = skillRepo;
		this.userRepo = userRepo;
		this.ldapSyncJob = ldapSyncJob;
	}

	@EventListener(ApplicationStartedEvent.class)
	public void init() throws IOException {
		if (!initmock) {
			return;
		}

		logger.warn("Mocking is enabled, this will overwrite all data in your DB");
		try {
			mockSkills();
			mockUsers();
		} catch (JSONException exception) {
			throw new RuntimeException(exception);
		}

		logger.info("Syncing mocked users with LDAP");
		ldapSyncJob.run();
		logger.info("Finished mock data setup");
	}

	private void mockSkills() throws IOException, JSONException {
		logger.warn("Deleting all skills in DB!");
		skillRepo.deleteAll();

		var skillsJsonArray = readMockFileToJsonArray(skillsPath);
		for (int i = 0; i < skillsJsonArray.length(); i++) {
			var skillJson = skillsJsonArray.getJSONObject(i);
			var skill = new Skill(skillJson.getString("name"));
			skill.setHidden(skillJson.getBoolean("hidden"));

			var subskillsJsonArray = skillJson.getJSONArray("subskills");
			for (int j = 0; j < subskillsJsonArray.length(); j++) {
				skill.addSubSkillName(subskillsJsonArray.getString(j));
			}
			skillRepo.save(skill);
		}

		logger.info("Added {} skills", skillsJsonArray.length());
	}

	private void mockUsers() throws IOException, JSONException {
		logger.warn("Deleting all users in DB");
		userRepo.deleteAll();

		var usersJsonArray = readMockFileToJsonArray(personsPath);
		for (int i = 0; i < usersJsonArray.length(); i++) {
			var userJson = usersJsonArray.getJSONObject(i);
			var user = new User(userJson.getString("id"));

			var skillsJsonArray = userJson.getJSONArray("skills");
			for (int j = 0; j < skillsJsonArray.length(); j++) {
				var skillJson = skillsJsonArray.getJSONObject(j);
				user.addUpdateSkill(skillJson.getString("name"), skillJson.getInt("skillLevel"),
					skillJson.getInt("willLevel"), false, false);
			}

			userRepo.save(user);
		}

		logger.info("Added {} users", usersJsonArray.length());
	}

	private JSONArray readMockFileToJsonArray(String path) throws IOException, JSONException {
		InputStreamReader reader = new InputStreamReader(getClass().getResourceAsStream("/mockdata/" + path));

		BufferedReader bufferedReader = new BufferedReader(reader);
		StringBuilder jsonString = new StringBuilder();

		String line = "";
		while ((line = bufferedReader.readLine()) != null) {
			jsonString.append(line);
		}

		return new JSONArray(jsonString.toString());
	}

}
