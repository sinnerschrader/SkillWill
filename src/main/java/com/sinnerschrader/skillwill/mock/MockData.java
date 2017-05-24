package com.sinnerschrader.skillwill.mock;

import com.sinnerschrader.skillwill.domain.person.Person;
import com.sinnerschrader.skillwill.domain.skills.KnownSkill;
import com.sinnerschrader.skillwill.jobs.LdapSyncJob;
import com.sinnerschrader.skillwill.repositories.PersonRepository;
import com.sinnerschrader.skillwill.repositories.SkillRepository;
import com.sinnerschrader.skillwill.services.LdapService;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import javax.annotation.PostConstruct;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Reads Mock Data from files specified in application.properties and
 * inserts it into DB. Handle with care, as this could delete all your data.
 *
 * @author torree
 */
@Component
public class MockData {

  private static final Logger logger = LoggerFactory.getLogger(MockData.class);

  @Autowired
  private SkillRepository skillRepo;

  @Autowired
  private PersonRepository personRepo;

  @Autowired
  private LdapSyncJob ldapSyncJob;

  @Value("${mockInit}")
  private Boolean initmock;

  @Value("${mockSkillFilePath}")
  private String skillsPath;

  @Value("${mockPersonsFilePath}")
  private String personsPath;

  private JSONArray readMockFileToJsonArray(String path) throws IOException {
    InputStreamReader reader = new InputStreamReader(getClass()
      .getResourceAsStream("/mockdata/" + path));

    BufferedReader bufferedReader = new BufferedReader(reader);
    String jsonString = "";

    String line = "";
    while ((line = bufferedReader.readLine()) != null) {
      jsonString += line;
    }

    return new JSONArray(jsonString);
  }

  private void mockPersons() throws IOException {
    logger.warn("Deleting all persons in DB");
    personRepo.deleteAll();

    JSONArray persons = readMockFileToJsonArray(personsPath);
    for (int i = 0; i < persons.length(); i++) {
      JSONObject personJson = persons.getJSONObject(i);
      Person person = new Person(personJson.getString("id"));

      JSONArray skills = personJson.getJSONArray("skills");
      for (int j = 0; j < skills.length(); j++) {
        JSONObject skillJson = skills.getJSONObject(j);
        person.addUpdateSkill(
          skillJson.getString("name"),
          skillJson.getInt("skillLevel"),
          skillJson.getInt("willLevel"),
          false
        );
      }

      logger.info("Inserting person " + person.getId());
      personRepo.save(person);
    }
  }

  private void mockSkills() throws IOException {
    logger.warn("Deleting all skills in DB");
    skillRepo.deleteAll();
    JSONArray skills = readMockFileToJsonArray(skillsPath);

    for (int i = 0; i < skills.length(); i++) {
      JSONObject skillJson = skills.getJSONObject(i);
      KnownSkill skill = new KnownSkill(skillJson.getString("name"), "foo");
      skill.setHidden(skillJson.getBoolean("hidden"));

      JSONArray subskillJson = skillJson.getJSONArray("subskills");
      for (int j = 0; j < subskillJson.length(); j++) {
        skill.addSubSkillName(subskillJson.getString(j));
      }

      logger.info("Inserting skill " + skill.getName());
      skillRepo.save(skill);
    }
  }

  @PostConstruct
  public void init() throws IOException {
    if (!initmock) {
      return;
    }

    logger.warn("Mocking is enabled, this will overwrite all data in your DB");
    mockSkills();
    mockPersons();

    logger.info("Syncing mocked users with LDAP");
    ldapSyncJob.run();
    logger.info("Finished mock data setup");
  }

}
