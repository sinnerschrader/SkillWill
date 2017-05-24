package com.sinnerschrader.skillwill.controllers;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;

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

import com.sinnerschrader.skillwill.domain.person.Person;
import com.sinnerschrader.skillwill.domain.skills.KnownSkill;
import com.sinnerschrader.skillwill.misc.EmbeddedLdap;
import com.sinnerschrader.skillwill.repositories.PersonRepository;
import com.sinnerschrader.skillwill.repositories.SessionRepository;
import com.sinnerschrader.skillwill.repositories.SkillRepository;
import com.sinnerschrader.skillwill.session.Session;
import com.unboundid.ldap.sdk.LDAPException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

/**
 * Integration test for UserController
 *
 * @author torree
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class UserControllerTest {

  @Autowired
  private UserController userController;

  @Autowired
  private PersonRepository personRepo;

  @Autowired
  private SkillRepository skillRepo;

  @Autowired
  private SessionRepository sessionRepo;

  @Autowired
  private EmbeddedLdap embeddedLdap;

  @Before
  public void setUp() throws LDAPException, IOException {
    embeddedLdap.reset();

    skillRepo.deleteAll();
    skillRepo.insert(new KnownSkill("Java", "icon descriptor"));
    skillRepo.insert(new KnownSkill("hidden", "hidden icon", new ArrayList<>(), true, new HashSet<>()));

    sessionRepo.deleteAll();
    Session session = new Session("abc123", "foobar", new Date());
    session.renewSession(60);
    sessionRepo.insert(session);

    personRepo.deleteAll();
    Person foobar = new Person("foobar");
    foobar.addUpdateSkill("Java", 2, 3, false);
    foobar.addUpdateSkill("hidden", 0, 1, true);
    personRepo.insert(foobar);
  }

  @Test
  public void testGetUserValid() throws JSONException {
    ResponseEntity<String> res = userController.getUser("foobar");
    assertEquals(HttpStatus.OK, res.getStatusCode());

    assertTrue(new JSONObject(res.getBody()).has("id"));
    assertTrue(new JSONObject(res.getBody()).get("id").equals("foobar"));

    assertTrue(new JSONObject(res.getBody()).has("firstName"));
    assertTrue(new JSONObject(res.getBody()).get("firstName").equals("Fooberius"));

    assertTrue(new JSONObject(res.getBody()).has("lastName"));
    assertTrue(new JSONObject(res.getBody()).get("lastName").equals("Barblub"));
  }

  @Test
  public void testGetUserInvalid() {
    assertEquals(HttpStatus.NOT_FOUND, userController.getUser("barfoo").getStatusCode());
  }

  @Test
  public void testGetUsersValid() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("Java", "Hamburg");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertTrue(new JSONObject(res.getBody()).has("searched"));
    assertEquals("Java", new JSONObject(res.getBody()).getJSONArray("searched").getString(0));
    assertEquals(1, new JSONObject(res.getBody()).getJSONArray("results").length());
    assertEquals("foobar", new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getString("id"));
    assertTrue(new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).has("fitness"));
  }

  @Test
  public void testGetUsersHideHidden() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("Java", "");
    JSONArray skillJson = new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getJSONArray("skills");
    assertEquals(1, skillJson.length());
    assertEquals("Java", skillJson.getJSONObject(0).getString("name"));
  }

  @Test
  public void testGetUsersSkillsEmpty() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("", "Hamburg");
    assertEquals(HttpStatus.OK, res.getStatusCode());    assertEquals("foobar", new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getString("id"));
    assertFalse(new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).has("fitness"));
    assertTrue(new JSONObject(res.getBody()).has("searched"));
    assertEquals(1, new JSONObject(res.getBody()).getJSONArray("results").length());
    assertEquals("foobar", new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getString("id"));
    assertFalse(new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).has("fitness"));
  }

  @Test
  public void testGetUsersSkillsNull() throws JSONException {
    ResponseEntity<String> res = userController.getUsers(null, "Hamburg");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertTrue(new JSONObject(res.getBody()).has("searched"));
    assertEquals(1, new JSONObject(res.getBody()).getJSONArray("results").length());
    assertEquals("foobar", new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getString("id"));
    assertFalse(new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).has("fitness"));
  }

  @Test
  public void testGetUsersSkillUnknownOnly() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("Unknown, More unknown", "");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertTrue(new JSONObject(res.getBody()).has("searched"));
    assertEquals(0, new JSONObject(res.getBody()).getJSONArray("searched").length());
    assertTrue(new JSONObject(res.getBody()).has("results"));
    assertEquals(0, new JSONObject(res.getBody()).getJSONArray("results").length());
  }

  @Test
  public void testGetUsersSkillUnknown() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("Unknown,Java", "");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertTrue(new JSONObject(res.getBody()).has("searched"));
    assertEquals(1, new JSONObject(res.getBody()).getJSONArray("searched").length());
    assertEquals("Java", new JSONObject(res.getBody()).getJSONArray("searched").getString(0));
    assertTrue(new JSONObject(res.getBody()).has("results"));
    assertEquals(1, new JSONObject(res.getBody()).getJSONArray("results").length());
    assertEquals("foobar", new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getString("id"));
  }

  @Test
  public void testGetUsersNoFitnessInEmptySearch() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("", "Hamburg");
    assertFalse(new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).has("fitness"));
  }

  @Test
  public void testGetUsersLocationEmpty() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("Java", "");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertTrue(new JSONObject(res.getBody()).has("searched"));
    assertEquals("Java", new JSONObject(res.getBody()).getJSONArray("searched").getString(0));
    assertEquals(1, new JSONObject(res.getBody()).getJSONArray("results").length());
    assertEquals("foobar", new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getString("id"));
    assertTrue(new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).has("fitness"));
  }

  @Test
  public void testGetUsersSkillsEmptyLocationEmpty() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("", "");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertTrue(new JSONObject(res.getBody()).has("searched"));
    assertEquals(1, new JSONObject(res.getBody()).getJSONArray("results").length());
    assertEquals("foobar", new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getString("id"));
    assertFalse(new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).has("fitness"));
  }

  @Test
  public void testGetUsersIgnoreSkillCase() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("JaVa", "Hamburg");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertTrue(new JSONObject(res.getBody()).has("searched"));
    assertEquals("Java", new JSONObject(res.getBody()).getJSONArray("searched").getString(0));
    assertEquals(1, new JSONObject(res.getBody()).getJSONArray("results").length());
    assertEquals("foobar", new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getString("id"));
    assertTrue(new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).has("fitness"));
  }

  @Test
  public void testGetUsersIgnoreNonAlphanumerics() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("j#a)_V®a", "Hamburg");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertTrue(new JSONObject(res.getBody()).has("searched"));
    assertEquals("Java", new JSONObject(res.getBody()).getJSONArray("searched").getString(0));
    assertEquals(1, new JSONObject(res.getBody()).getJSONArray("results").length());
    assertEquals("foobar", new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).getString("id"));
    assertTrue(new JSONObject(res.getBody()).getJSONArray("results").getJSONObject(0).has("fitness"));
  }

  @Test
  public void testGetUsersLocationUnknown() throws JSONException {
    ResponseEntity<String> res = userController.getUsers("Java", "IAmUnknown");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals(0, new JSONObject(res.getBody()).getJSONArray("results").length());
  }

  @Test
  public void testModifySkillsValid() {
    ResponseEntity<String> res = userController.updateSkills("foobar", "Java", "3", "0", "abc123");
    assertEquals(HttpStatus.OK, res.getStatusCode());
    assertEquals(3, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getSkillLevel());
    assertEquals(0, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getWillLevel());
  }

  @Test
  public void testModifySkillsLevelsZero() {
    ResponseEntity<String> res = userController.updateSkills("foobar", "Java", "0", "0", "abc123");
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
  }

  @Test
  public void testModifySkillsLevelOverMax() {
    ResponseEntity<String> res = userController.updateSkills("foobar", "Java", "0", "4", "abc123");
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
  }

  @Test
  public void testModifySkillsSessionInvalid() {
    ResponseEntity<String> res = userController.updateSkills("foobar", "Java", "0", "0", "InvalidSession");
    assertEquals(HttpStatus.UNAUTHORIZED, res.getStatusCode());
    assertEquals(2, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getSkillLevel());
    assertEquals(3, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getWillLevel());
  }

  @Test
  public void testModifySkillsUserUnknown() {
    sessionRepo.deleteAll();
    Session session = new Session("2342", "IAmUnknown", new Date());
    session.renewSession(60);
    sessionRepo.insert(session);

    ResponseEntity<String> res = userController.updateSkills("IAmUnknown", "Java", "0", "0", "2342");
    assertEquals(HttpStatus.NOT_FOUND, res.getStatusCode());
    assertEquals(2, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getSkillLevel());
    assertEquals(3, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getWillLevel());
  }

  @Test
  public void testModifySkillsSkillUnknown() {
    ResponseEntity<String> res = userController.updateSkills("foobar", "UnknownSkill", "0", "0", "abc123");
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
    assertEquals(2, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getSkillLevel());
    assertEquals(3, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getWillLevel());
  }

  @Test
  public void testModifySkillsSkillLevelOutOfRange() {
    ResponseEntity<String> res = userController.updateSkills("foobar", "Java", "5", "0", "abc123");
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
    assertEquals(2, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getSkillLevel());
    assertEquals(3, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getWillLevel());
  }

  @Test
  public void testModifySkillsWillLevelOutOfRange() {
    ResponseEntity<String> res = userController.updateSkills("foobar", "Java", "0", "5", "abc123");
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
    assertEquals(2, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getSkillLevel());
    assertEquals(3, personRepo.findById("foobar").getSkillsExcludeHidden().get(0).getWillLevel());
  }

  @Test
  public void testModifySkillsHidden() {
    assertEquals(HttpStatus.BAD_REQUEST, userController.updateSkills("foobar", "hidden", "0", "3", "abc123").getStatusCode());
    assertNull(personRepo.findById("foobar").getSkillExcludeHidden("hidden"));
  }

  @Test
  public void testRemoveSkill() {
    ResponseEntity<String> res = userController.removeSkill("foobar", "Java", "abc123");
    assertEquals(HttpStatus.OK, res.getStatusCode());
  }

  @Test
  public void testRemoveSkillSkillUnknown() {
    ResponseEntity<String> res = userController.removeSkill("foobar", "UNKNOWN", "abc123");
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
  }

  @Test
  public void testRemoveSkillUserUnknown() {
    ResponseEntity<String> res = userController.removeSkill("IAmUnknown", "Java", "abc123");
    assertEquals(HttpStatus.UNAUTHORIZED, res.getStatusCode());
  }

  @Test
  public void testRemoveSkillUserUnauthorized() {
    ResponseEntity<String> res = userController.removeSkill("foobar", "Java", "IAmUnknown");
    assertEquals(HttpStatus.UNAUTHORIZED, res.getStatusCode());
  }

  @Test
  public void testSetCommentValid() throws JSONException {
    ResponseEntity<String> res = userController.updateDetails("foobar", "abc123", "insert comment here");
    assertEquals(HttpStatus.OK, res.getStatusCode());

    res = userController.getUser("foobar");
    assertEquals("insert comment here", new JSONObject(res.getBody()).getString("comment"));
  }

  @Test
  public void testSetCommentUnicode() throws JSONException {
    ResponseEntity<String> res = userController.updateDetails("foobar", "abc123", "本产品可能含有网络的痕迹");
    assertEquals(HttpStatus.OK, res.getStatusCode());

    res = userController.getUser("foobar");
    assertEquals("本产品可能含有网络的痕迹", new JSONObject(res.getBody()).getString("comment"));
  }

  @Test
  public void testSetCommentEmpty() throws JSONException {
    ResponseEntity<String> res = userController.updateDetails("foobar", "abc123", "");
    assertEquals(HttpStatus.OK, res.getStatusCode());

    res = userController.getUser("foobar");
    assertFalse(new JSONObject(res.getBody()).has("comment"));
  }

  @Test
  public void testSetCommentNull() throws JSONException {
    userController.updateDetails("foobar", "abc123", "insert comment here");
    ResponseEntity<String> res = userController.updateDetails("foobar", "abc123", null);
    assertEquals(HttpStatus.OK, res.getStatusCode());

    res = userController.getUser("foobar");
    assertFalse(new JSONObject(res.getBody()).has("comment"));
  }

  @Test
  public void testSetCommentUserNotLoggedIn() {
    ResponseEntity<String> res = userController.updateDetails("foobar", "ThisIsNotASessionKey", "comment");
    assertEquals(HttpStatus.UNAUTHORIZED, res.getStatusCode());
  }

  @Test
  public void testGetSimilarUser() throws JSONException {
    Person p1 = new Person("abc");
    p1.addUpdateSkill("Java", 1, 2, false);
    p1.addUpdateSkill(".NET", 3, 2, false);
    p1.addUpdateSkill("Text", 1, 3, false);
    personRepo.insert(p1);

    Person p2 = new Person("def");
    p2.addUpdateSkill("Java", 3, 2, false);
    personRepo.insert(p2);

    Person p3 = new Person("ghi");
    p3.addUpdateSkill("Java", 1, 0, false);
    p3.addUpdateSkill(".NET", 3, 2, false);
    personRepo.insert(p3);

    ResponseEntity<String> res = userController.getSimilar("abc", 1);
    assertEquals(1, new JSONArray(res.getBody()).length());
    assertEquals("ghi", new JSONArray(res.getBody()).getJSONObject(0).getString("id"));
  }

  @Test
  public void testGetSimilarUserNotFound() {
    ResponseEntity<String> res = userController.getSimilar("IAmUnknown", 42);
    assertEquals(HttpStatus.NOT_FOUND, res.getStatusCode());
  }

  @Test
  public void testGetSimilarUserCountNegative() {
    ResponseEntity<String> res = userController.getSimilar("foobar", -1);
    assertEquals(HttpStatus.BAD_REQUEST, res.getStatusCode());
  }

}
