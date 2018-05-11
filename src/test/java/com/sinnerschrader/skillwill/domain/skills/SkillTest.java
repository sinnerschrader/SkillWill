package com.sinnerschrader.skillwill.domain.skills;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Partial unit tests for Skill
 *
 * @author torree
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class SkillTest {

  private Skill skill;

  @Before
  public void setUp() {
    skill = new Skill("Java");
    skill.incrementSuggestion("COBOL");
  }

  @Test
  public void testAddSuggestion() {
    skill.incrementSuggestion("PHP");
    assertEquals("PHP", skill.getSuggestions().get(1).getName());
  }

  @Test
  public void testRenameSuggestion() {
    skill.renameSuggestion("COBOL", "PHP");
    assertEquals("PHP", skill.getSuggestions().get(0).getName());
  }

  @Test
  public void testIncrementSuggestion() {
    skill.incrementSuggestion("COBOL");
    assertEquals(2, skill.getSuggestions().get(0).getCount());
  }

  @Test
  public void testDeleteSuggestion() {
    skill.deleteSuggestion("COBOL");
    assertTrue(skill.getSuggestions().isEmpty());
  }

  @Test
  public void testToJSON() throws JSONException {
    JSONObject obj = skill.toJSON();
    assertEquals(3, obj.length());
    assertEquals("Java", obj.getString("name"));
    assertFalse(obj.getBoolean("hidden"));
    assertEquals(new JSONArray(), obj.getJSONArray("subskills"));
  }

}
