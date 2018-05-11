package com.sinnerschrader.skillwill.controllers;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import com.sinnerschrader.skillwill.domain.skills.Skill;
import com.sinnerschrader.skillwill.domain.user.User;
import com.sinnerschrader.skillwill.domain.user.Role;
import com.sinnerschrader.skillwill.misc.EmbeddedLdap;
import com.sinnerschrader.skillwill.repositories.UserRepository;
import com.sinnerschrader.skillwill.repositories.SessionRepository;
import com.sinnerschrader.skillwill.repositories.SkillRepository;
import com.sinnerschrader.skillwill.services.LdapService;
import com.sinnerschrader.skillwill.session.Session;
import com.unboundid.ldap.sdk.LDAPException;
import java.util.ArrayList;
import java.util.HashSet;
import org.json.JSONArray;
import org.json.JSONException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Integration test for SkillController
 *
 * @author torree
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class SkillControllerTest {

  @Autowired
  private SkillController skillController;

  @Autowired
  private SkillRepository skillRepo;

  @Autowired
  private UserRepository userRepo;

  @Autowired
  private SessionRepository sessionRepo;

  @Autowired
  private LdapService ldapService;

  @Autowired
  private EmbeddedLdap embeddedLdap;

  @Before
  public void setUp() throws LDAPException {
    embeddedLdap.reset();
    skillRepo.deleteAll();
    sessionRepo.deleteAll();
    userRepo.deleteAll();

    var hiddenSkill = new Skill("hidden skill", new ArrayList<>(), true, new HashSet<>());
    skillRepo.insert(hiddenSkill);

    var javaSkill = new Skill("Java");
    javaSkill.incrementSuggestion("COBOL");
    javaSkill.incrementSuggestion("hidden skill");
    skillRepo.insert(javaSkill);

    var cobolSkill = new Skill("COBOL");
    cobolSkill.incrementSuggestion("Java");
    skillRepo.insert(cobolSkill);

    var userUser = new User("aaaaaa");
    userRepo.insert(userUser);

    var adminUser = new User("bbbbbb");
    adminUser.setRole(Role.ADMIN);
    userRepo.insert(adminUser);

    ldapService.syncUsers(userRepo.findAll(), true);

    var userSession = new Session("YWFhLmFhYUBleGFtcGxlLmNvbQ==|foo|bar");
    sessionRepo.insert(userSession);

    var adminSession = new Session("YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    sessionRepo.insert(adminSession);
  }

  @Test
  public void testGetSkillsValidQuery() throws JSONException {
    var response = skillController.getSkills("COB", true, -1);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    var responseJSON = new JSONArray(response.getBody());
    assertEquals(1, responseJSON.length());
    assertEquals("COBOL", responseJSON.getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetSkillsEmptyQuery() throws JSONException {
    var response = skillController.getSkills("", true, -1);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    var responseJson = new JSONArray(response.getBody());
    assertEquals(2, responseJson.length());
    assertEquals("Java", responseJson.getJSONObject(0).getString("name"));
    assertEquals("COBOL", responseJson.getJSONObject(1).getString("name"));
  }

  @Test
  public void testGetSkillsUnknownSkill() throws JSONException {
    var response = skillController.getSkills("glibberish", true, -1);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    var responseJson = new JSONArray(response.getBody());
    assertEquals(0, responseJson.length());
  }

  @Test
  public void testGetSkillsHidden() throws JSONException {
    // test getSkills with excluded hidden skills => no results
    var response = skillController.getSkills("hidden", true, -1);
    assertEquals(0, new JSONArray(response.getBody()).length());

    // do not exclude hidden => one result
    response = skillController.getSkills("hidden", false, -1);
    assertEquals(1, new JSONArray(response.getBody()).length());
    assertEquals("hidden skill", new JSONArray(response.getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetSkillsCountNegative() throws JSONException {
    var response = skillController.getSkills("", true, -1);
    assertEquals(2, new JSONArray(response.getBody()).length());
  }

  @Test
  public void testGetSkillsCountZero() throws JSONException {
    var response = skillController.getSkills("", true, 0);
    assertEquals(2, new JSONArray(response.getBody()).length());
  }

  @Test
  public void testGetSkillsCountPositive() throws JSONException {
    var response = skillController.getSkills("", true, 1);
    assertEquals(1, new JSONArray(response.getBody()).length());
  }

  @Test
  public void testGetSkillsCountHigherThanFound() throws JSONException {
    var response = skillController.getSkills("", true, 42);
    assertEquals(2, new JSONArray(response.getBody()).length());
  }

  @Test
  public void testGetNextValid() throws JSONException {
    var response = skillController.getNext("Java", 1);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("COBOL", new JSONArray(response.getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetNextIgnoreCase() throws JSONException {
    var response = skillController.getNext("JaVa", 1);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("COBOL", new JSONArray(response.getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetNextStemminng() throws JSONException {
    var response = skillController.getNext("j#a)_V®a", 1);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals("COBOL", new JSONArray(response.getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetNextCountZero() {
    var response = skillController.getNext("Java", 0);
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
  }

  @Test
  public void testGetNextCountNegative() {
    var response = skillController.getNext("Java", -1);
    assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
  }

  @Test
  public void testGetNextCountMoreThanSkills() throws JSONException {
    var response = skillController.getNext("Java", 42);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(1, new JSONArray(response.getBody()).length());
    assertEquals("COBOL", new JSONArray(response.getBody()).getJSONObject(0).get("name"));
  }

  @Test
  public void testGetNextExcludeHidden() throws JSONException {
    var response = skillController.getNext("Java", 2);
    assertEquals(1, new JSONArray(response.getBody()).length());
    assertNotEquals("hidden skill", new JSONArray(response.getBody()).getString(0));
  }


  @Test
  public void testgetNextDoubleSearch() throws JSONException {
    var response = skillController.getNext("Java, COBOL", 1);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(0, new JSONArray(response.getBody()).length());
  }

  @Test
  public void testGetNextEmptySearch() {
    var response = skillController.getNext("", 1);
    assertEquals(HttpStatus.OK, response.getStatusCode());
  }

  @Test
  public void testGetNextUnknownSearch() throws JSONException {
    var response = skillController.getNext("IAmUnknown", 1);
    assertEquals(HttpStatus.OK, response.getStatusCode());
    assertEquals(0, new JSONArray(response.getBody()).length());
  }

  @Test
  public void testAddSkillValid() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.addSkill("foo", false, "", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertEquals("foo", new JSONArray(skillController.getSkills("fo", true, -1).getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testAddSkillEmptyName() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.addSkill("", false, "", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
  }

  @Test
  public void testAddSkillDuplicateName() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.addSkill("Java", false, "", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
  }

  @Test
  public void testAddSkillWithSubskills() {
    assertEquals(HttpStatus.OK, skillController.addSkill("New Skill", false, "Java, COBOL", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertEquals(HttpStatus.OK, skillController.getSkill("New Skill").getStatusCode());
  }

  @Test
  public void testAddSkillWithUnknownSubskill() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.addSkill("New Skill", false, "Java, COBOL, Wurstwasser", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertEquals(HttpStatus.NOT_FOUND, skillController.getSkill("New Skill").getStatusCode());
  }

  @Test
  public void testAddSkillWithHiddenSubskill() {
    assertEquals(HttpStatus.OK, skillController.addSkill("New Skill", false, "Java, hidden skill", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
  }

  @Test
  public  void testAddSkillUnprivilegedRole() {
    assertEquals(HttpStatus.FORBIDDEN, skillController.addSkill("New Skill", false, "Java, hidden skill", "YWFhLmFhYUBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
  }

  @Test
  public void testDeleteValid() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.deleteSkill("Java", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar", null).getStatusCode());
    assertEquals(0, new JSONArray(skillController.getNext("COBOL", 1).getBody()).length());
  }

  @Test
  public void testDeleteEmpty() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.deleteSkill("", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar", null).getStatusCode());
  }

  @Test
  public void testDeleteUnknown() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.deleteSkill("foo", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar", null).getStatusCode());
  }

  @Test
  public void testDeleteUnprivilegedRole() {
    assertEquals(HttpStatus.FORBIDDEN, skillController.deleteSkill("foo", "YWFhLmFhYUBleGFtcGxlLmNvbQ==|foo|bar", null).getStatusCode());
  }

  @Test
  public void testDeleteMigrateTargetNotFound() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.deleteSkill("Java", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar", "Ramalamadingdong").getStatusCode());
    assertNotNull(skillRepo.findByName("Java"));
  }

  @Test
  public void testDeleteMigrateToSource() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.deleteSkill("Java", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar", "Java").getStatusCode());
    assertNotNull(skillRepo.findByName("Java"));
  }

  @Test
  public void testDeleteMigrate() {
    var user = userRepo.findByIdIgnoreCase("aaaaaa");
    user.addUpdateSkill("Java", 1, 3, false, true);
    userRepo.save(user);

    assertEquals(HttpStatus.OK, skillController.deleteSkill("Java", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar", "COBOL").getStatusCode());
    assertNull(skillRepo.findByName("Java"));

    user = userRepo.findByIdIgnoreCase("aaaaaa");
    assertEquals(1, user.getSkill("COBOL", true).getSkillLevel());
    assertEquals(3, user.getSkill("COBOL", true).getWillLevel());
    assertTrue(user.getSkill("COBOL", true).isMentor());
    assertFalse(user.getSkill("COBOL", true).isHidden());
    assertNull(user.getSkill("Java", true));
  }

  @Test
  public void testDeleteMigrateAlreadyHavingTarget() {
    var user = userRepo.findByIdIgnoreCase("aaaaaa");
    user.addUpdateSkill("Java", 1, 3, false, true);
    user.addUpdateSkill("COBOL", 2, 0, false, false);
    userRepo.save(user);

    assertEquals(HttpStatus.OK, skillController.deleteSkill("Java", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar", "COBOL").getStatusCode());
    assertNull(skillRepo.findByName("Java"));

    user = userRepo.findByIdIgnoreCase("aaaaaa");
    assertEquals(2, user.getSkill("COBOL", true).getSkillLevel());
    assertEquals(0, user.getSkill("COBOL", true).getWillLevel());
    assertFalse(user.getSkill("COBOL", true).isMentor());
    assertFalse(user.getSkill("COBOL", true).isHidden());
    assertNull(user.getSkill("Java", true));
  }

  @Test
  public void testDeleteMigrateNoSkill() {
    var user = userRepo.findByIdIgnoreCase("aaaaaa");
    user.addUpdateSkill("Java", 1, 3, false, true);
    userRepo.save(user);

    assertEquals(HttpStatus.OK, skillController.deleteSkill("COBOL", "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar", "Java").getStatusCode());
    assertNull(skillRepo.findByName("COBOL"));

    user = userRepo.findByIdIgnoreCase("aaaaaa");
    assertEquals(1, user.getSkill("Java", true).getSkillLevel());
    assertEquals(3, user.getSkill("Java", true).getWillLevel());
    assertTrue(user.getSkill("Java", true).isMentor());
    assertFalse(user.getSkill("Java", true).isHidden());
    assertNull(user.getSkill("COBOL", true));
  }

  @Test
  public void testEditValid() {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", "foobar", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNull(skillRepo.findByName("Java"));
    assertNotNull(skillRepo.findByName("foobar"));
  }

  @Test
  public void testEditOldUnknown() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.updateSkill("foobar", "barfoo", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNull(skillRepo.findByName("barfoo"));
    assertNull(skillRepo.findByName("foobar"));
  }

  @Test
  public void testEditOldEmpty() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.updateSkill("", "barfoo", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNull(skillRepo.findByName(""));
    assertNull(skillRepo.findByName("foobar"));
  }

  @Test
  public void testEditOldNull() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.updateSkill(null, "barfoo", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNull(skillRepo.findByName("barfoo"));
  }

  @Test
  public void testEditNewExisting() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.updateSkill("Java", "COBOL", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNotNull(skillRepo.findByName("Java"));
  }

  @Test
  public void testEditNewEmptyString() {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", "", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNotNull(skillRepo.findByName("Java"));
    assertNull(skillRepo.findByName(""));
  }

  @Test
  public void testEditNewNull() {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", null, null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNotNull(skillRepo.findByName("Java"));
  }

  @Test
  public void testEditOldHasSpace() {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java ", "Foobar", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNotNull(skillRepo.findByName("Foobar"));
  }

  @Test
  public void testEditNewHasSpaceValid() {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", "Foobar ", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNotNull(skillRepo.findByName("Foobar"));
  }

  @Test
  public void testEditNewHasSpaceExisting() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.updateSkill("Java", " COBOL", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar").getStatusCode());
    assertNotNull(skillRepo.findByName("Java"));
  }

  @Test
  public void testEditKeepSubskills() {
   skillController.updateSkill("Java", "foobar", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
   assertEquals("COBOL", skillRepo.findByName("foobar").getSuggestions().get(0).getName());
  }

  @Test
  public void testEditRenameSubskills() {
    skillController.updateSkill("Java", "foobar", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertEquals("foobar", skillRepo.findByName("COBOL").getSuggestions().get(0).getName());
  }

  @Test
  public void testEditRenameSubskillsWithSpace() {
    skillController.updateSkill("Java", "foobar ", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertEquals("foobar", skillRepo.findByName("COBOL").getSuggestions().get(0).getName());
  }

  @Test
  public void testEditKeepPersonalSkillsWithNull() {
    var user = userRepo.findByIdIgnoreCase("aaaaaa");
    user.addUpdateSkill("Java", 3, 3, false, true);
    userRepo.save(user);

    skillController.updateSkill("Java", null, null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertEquals("aaaaaa", userRepo.findBySkill("Java").get(0).getId());
  }

  @Test
  public void testEditKeepPersonalSkillsWithEmpty() {
    var user = userRepo.findByIdIgnoreCase("aaaaaa");
    user.addUpdateSkill("Java", 3, 3, false, true);
    userRepo.save(user);

    skillController.updateSkill("Java", "", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertEquals("aaaaaa", userRepo.findBySkill("Java").get(0).getId());
  }

  @Test
  public void testEditRenamePersonalSkills() {
    var user = userRepo.findByIdIgnoreCase("aaaaaa");
    user.addUpdateSkill("Java", 3, 3, false, true);
    userRepo.save(user);

    skillController.updateSkill("Java", "Foobar", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertEquals("aaaaaa", userRepo.findBySkill("Foobar").get(0).getId());
  }

  @Test
  public void testEditRenamePersonalSkillsWithSpace() {
    var user = userRepo.findByIdIgnoreCase("aaaaaa");
    user.addUpdateSkill("Java", 3, 3, false, true);
    userRepo.save(user);

    skillController.updateSkill("Java", "Foobar ", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertEquals("aaaaaa", userRepo.findBySkill("Foobar").get(0).getId());
  }

  @Test
  public void testEditKeepPersonalSkillsVisibility() {
    var user = userRepo.findByIdIgnoreCase("aaaaaa");
    user.addUpdateSkill("Java", 3, 3, false, true);
    userRepo.save(user);

    skillController.updateSkill("Java", "", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertFalse(userRepo.findBySkill("Java").get(0).getSkill("Java", true).isHidden());
  }

  @Test
  public void testEditPersonalSkillsHide() {
    var user = userRepo.findByIdIgnoreCase("aaaaaa");
    user.addUpdateSkill("Java", 3, 3, false, true);
    userRepo.save(user);

    skillController.updateSkill("Java", "", true, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertTrue(userRepo.findBySkill("Java").get(0).getSkill("Java", false).isHidden());
  }

  @Test
  public void testEditKeepSuggestions() {
    skillController.updateSkill("Java", "", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertEquals(1, skillRepo.findByName("COBOL").getSuggestions().size());
    assertEquals("Java", skillRepo.findByName("COBOL").getSuggestions().get(0).getName());
  }

  @Test
  public void testEditRenameSuggestions() {
    skillController.updateSkill("Java", "Foobar", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertEquals(1, skillRepo.findByName("COBOL").getSuggestions().size());
    assertEquals("Foobar", skillRepo.findByName("COBOL").getSuggestions().get(0).getName());
  }

  @Test
  public void testEditRenameSuggestionsWithSpace() {
    skillController.updateSkill("Java", "   Foobar ", null, null, "YmJiLmJiYkBleGFtcGxlLmNvbQ==|foo|bar");
    assertEquals(1, skillRepo.findByName("COBOL").getSuggestions().size());
    assertEquals("Foobar", skillRepo.findByName("COBOL").getSuggestions().get(0).getName());
  }

  @Test
  public void testEditSkillUnprivileged() {
    assertEquals(HttpStatus.FORBIDDEN, skillController.updateSkill("Java", null, false, "Rama Lama, Ding Ding, Dong", "useressionkey").getStatusCode());
  }

}
