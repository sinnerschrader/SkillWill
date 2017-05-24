package com.sinnerschrader.skillwill.controllers;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

import com.sinnerschrader.skillwill.domain.skills.KnownSkill;
import com.sinnerschrader.skillwill.misc.EmbeddedLdap;
import com.sinnerschrader.skillwill.repositories.SkillRepository;
import com.unboundid.ldap.sdk.LDAPException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
  private EmbeddedLdap embeddedLdap;

  @Before
  public void setUp() throws LDAPException, IOException {
    embeddedLdap.reset();
    skillRepo.deleteAll();

    KnownSkill hiddenSkill = new KnownSkill("hidden skill", "hidden icon", new ArrayList<>(), true, new HashSet<>());
    skillRepo.insert(hiddenSkill);

    KnownSkill javaSkill = new KnownSkill("Java", "java descriptor");
    javaSkill.incrementSuggestion("COBOL");
    javaSkill.incrementSuggestion("hidden skill");
    skillRepo.insert(javaSkill);

    KnownSkill cobolSkill = new KnownSkill("COBOL", "cobol descriptor");
    cobolSkill.incrementSuggestion("Java");
    skillRepo.insert(cobolSkill);
  }

  @Test
  public void testGetSkillsValidQuery() throws JSONException {
    ResponseEntity<String> res = skillController.getSkills("COB", true);
    assertEquals(HttpStatus.OK, res.getStatusCode());
    JSONArray resJSON = new JSONArray(res.getBody());
    assertEquals(1, resJSON.length());
    assertEquals("COBOL", resJSON.getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetSkillsEmptyQuery() throws JSONException {
    ResponseEntity<String> res = skillController.getSkills("", true);
    assertEquals(HttpStatus.OK, res.getStatusCode());
    JSONArray resJSON = new JSONArray(res.getBody());
    assertEquals(2, resJSON.length());
    assertEquals("Java", resJSON.getJSONObject(0).getString("name"));
    assertEquals("COBOL", resJSON.getJSONObject(1).getString("name"));
  }

  @Test
  public void testGetSkillsUnknownSkill() throws JSONException {
    ResponseEntity<String> res = skillController.getSkills("glibberish", true);
    assertEquals(HttpStatus.OK, res.getStatusCode());
    JSONArray resJSON = new JSONArray(res.getBody());
    assertEquals(0, resJSON.length());
  }

  @Test
  public void testGetSkillsHidden() throws JSONException {
    ResponseEntity<String> res = skillController.getSkills("hidden", true);
    assertEquals(0, new JSONArray(res.getBody()).length());
    res = skillController.getSkills("hidden", false);
    assertEquals(1, new JSONArray(res.getBody()).length());
    assertEquals("hidden skill", new JSONArray(res.getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetNextValid() throws JSONException {
    ResponseEntity<String> res = skillController.getNext("Java", 1);
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals("COBOL", new JSONArray(res.getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetNextIgnoreCase() throws JSONException {
    ResponseEntity<String> res = skillController.getNext("JaVa", 1);
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals("COBOL", new JSONArray(res.getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetNextStemminng() throws JSONException {
    ResponseEntity<String> res = skillController.getNext("j#a)_V®a", 1);
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals("COBOL", new JSONArray(res.getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetNextCountZero() throws JSONException {
    ResponseEntity<String> res = skillController.getNext("Java", 0);
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
  }

  @Test
  public void testGetNextCountNegative() {
    ResponseEntity<String> res = skillController.getNext("Java", -1);
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
  }

  @Test
  public void testGetNextCountMoreThanSkills() throws JSONException {
    ResponseEntity<String> res = skillController.getNext("Java", 42);
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals(1, new JSONArray(res.getBody()).length());
    assertEquals("COBOL", new JSONArray(res.getBody()).getJSONObject(0).get("name"));
  }

  @Test
  public void testGetNextExcludeHidden() throws JSONException {
    ResponseEntity<String> res = skillController.getNext("Java", 2);
    assertEquals(1, new JSONArray(res.getBody()).length());
    assertNotEquals("hidden skill", new JSONArray(res.getBody()).getString(0));
  }


  @Test
  public void testgetNextDoubleSearch() throws JSONException {
    ResponseEntity<String> res = skillController.getNext("Java, COBOL", 1);
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals(0, new JSONArray(res.getBody()).length());
  }

  @Test
  public void testGetNextEmptySearch() {
    ResponseEntity<String> res = skillController.getNext("", 1);
    assertEquals(HttpStatus.OK, res.getStatusCode());
  }

  @Test
  public void testGetNextUnknownSearch() throws JSONException {
    ResponseEntity<String> res = skillController.getNext("IAmUnknown", 1);
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals(0, new JSONArray(res.getBody()).length());
  }

  @Test
  public void testAddSkillValid() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.addSkill("foo", "foo descriptor", false, "").getStatusCode());
    assertEquals("foo", new JSONArray(skillController.getSkills("fo", true).getBody()).getJSONObject(0).getString("name"));
  }

  @Test
  public void testAddSkillEmptyName() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.addSkill("", "", false, "").getStatusCode());
  }

  @Test
  public void testAddSkillDuplicateName() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.addSkill("Java", "java descriptor", false, "").getStatusCode());
  }

  @Test
  public void testAddSkillWithSubskills() {
    assertEquals(HttpStatus.OK, skillController.addSkill("New Skill", "descriptor", false, "Java, COBOL").getStatusCode());
    assertEquals(HttpStatus.OK, skillController.getSkill("New Skill").getStatusCode());
  }

  @Test
  public void testAddSkillWithUnknownSubskill() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.addSkill("New Skill", "descriptor", false, "Java, COBOL, Wurstwasser").getStatusCode());
    assertEquals(HttpStatus.NOT_FOUND, skillController.getSkill("New Skill").getStatusCode());
  }

  @Test
  public void testAddSkillWithHiddenSubskill() {
    assertEquals(HttpStatus.OK, skillController.addSkill("New Skill", "descriptor", false, "Java, hidden skill").getStatusCode());
  }

  @Test
  public void testDeleteValid() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.deleteSkill("Java").getStatusCode());
    assertEquals(0, new JSONArray(skillController.getNext("COBOL", 1).getBody()).length());
  }

  @Test
  public void testDeleteEmpty() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.deleteSkill("").getStatusCode());
  }

  @Test
  public void testDeleteUnknown() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.deleteSkill("foo").getStatusCode());
  }

  @Test
  public void testEditSkillValid() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.updateSkill("COBOL", "foo", "", false, "COBOL").getStatusCode());
    assertEquals("foo", new JSONArray(skillController.getNext("Java", 1).getBody()).getJSONObject(0).get("name"));
  }

  @Test
  public void testEditSkillEmptyName() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.updateSkill("", "foo", "", false, "COBOL").getStatusCode());
  }

  @Test
  public void testEditSkillNullName() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", null, "", false, "COBOL").getStatusCode());
    assertEquals("Java", new JSONArray(skillController.getNext("COBOL", 1).getBody()).getJSONObject(0).get("name"));
  }

  @Test
  public void testEditSkillUnknown() {
    assertEquals(HttpStatus.NOT_FOUND, skillController.updateSkill("foo", "bar", "bar descriptor", false, "COBOL").getStatusCode());
  }

  @Test
  public void testEditSkillToExisting() throws JSONException {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.updateSkill("Java", "COBOL", "", false, "COBOL").getStatusCode());
    assertEquals("COBOL", new JSONArray(skillController.getNext("Java", 1).getBody()).getJSONObject(0).get("name"));
    assertEquals("Java", new JSONArray(skillController.getNext("COBOL", 1).getBody()).getJSONObject(0).get("name"));
  }

  @Test
  public void testEditSkillValidIconDescriptor() throws JSONException {
    skillController.updateSkill("Java", "Java", "This is a new descriptor", false, "COBOL");
    ResponseEntity<String> res = skillController.getSkill("Java");
    assertEquals("This is a new descriptor", new JSONObject(res.getBody()).getString("iconDescriptor"));
  }

  @Test
  public void testEditSkillEmptyDescriptor() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", "Java", "", false, "COBOL").getStatusCode());
    System.out.println(skillController.updateSkill("Java", "Java", "", false, "COBOL").getStatusCode().toString());
    ResponseEntity<String> res = skillController.getSkill("Java");
    assertEquals("", new JSONObject(res.getBody()).getString("iconDescriptor"));
  }

  @Test
  public void testEditSkillUnicodeDescriptor() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", "Java", "đây là một biểu tượng", false, "COBOL").getStatusCode());
    ResponseEntity<String> res = skillController.getSkill("Java");
    assertEquals("đây là một biểu tượng", new JSONObject(res.getBody()).getString("iconDescriptor"));
  }

  @Test
  public void testEditSkillNullDescriptor() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", "Java", null, false, "COBOL").getStatusCode());
    ResponseEntity<String> res = skillController.getSkill("Java");
    assertEquals("java descriptor", new JSONObject(res.getBody()).getString("iconDescriptor"));
  }

  @Test
  public void testEditSkillValidsubSkill() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", "Java", null, false, "COBOL").getStatusCode());
    ResponseEntity<String> res = skillController.getSkill("Java");
    JSONArray resSubSkillsJson = new JSONObject(res.getBody()).getJSONArray("subskills");
    assertEquals(1, resSubSkillsJson.length());
    assertEquals("COBOL", resSubSkillsJson.getString(0));
  }

  @Test
  public void testEditSkillEmptySubSkill() throws JSONException {
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", "Java", null, false, "").getStatusCode());
    assertEquals(0, new JSONObject(skillController.getSkill("Java").getBody()).getJSONArray("subskills").length());
  }

  @Test
  public void testEditSkillNullSubSkill() throws JSONException {
    JSONArray beforeSubskills = new JSONObject(skillController.getSkill("Java").getBody()).getJSONArray("subskills");
    assertEquals(HttpStatus.OK, skillController.updateSkill("Java", null, null, null, null).getStatusCode());
    JSONArray afterSubSkills = new JSONObject(skillController.getSkill("Java").getBody()).getJSONArray("subskills");
    assertEquals(beforeSubskills, afterSubSkills);
  }

  @Test
  public void testEditSkillUnknownSubskill() {
    assertEquals(HttpStatus.BAD_REQUEST, skillController.updateSkill("Java", null, null, false, "Rama Lama, Ding Ding, Dong").getStatusCode());
  }

}