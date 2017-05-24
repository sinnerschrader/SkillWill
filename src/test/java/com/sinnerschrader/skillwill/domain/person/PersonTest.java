package com.sinnerschrader.skillwill.domain.person;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Partial unit tests for Person
 *
 * @author torree
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class PersonTest {

  private Person person;

  @Before
  public void init() {
    person = new Person("foobar");
    person.addUpdateSkill("skillname", 2, 3, false);
  }

  @Test
  public void testAddUpdateNewSkill() {
    person.addUpdateSkill("new skill", 2, 3, false);
    assertEquals(2, person.getSkillsExcludeHidden().size());
  }

  @Test
  public void testAddUpdateKnownSkill() {
    person.addUpdateSkill("skillname", 0, 1, false);
    assertEquals(1, person.getSkillsExcludeHidden().size());
    assertEquals(0, person.getSkillsExcludeHidden().get(0).getSkillLevel());
    assertEquals(1, person.getSkillsExcludeHidden().get(0).getWillLevel());
  }

  @Test
  public void testToJson() throws JSONException {
    person.setComment("comment");
    person.setLdapDetails(
        new PersonalLdapDetails(
            "Fooberius",
            "Barblub",
            "fooberius.barblub@sinnerschrader.com",
            "+49 666 666",
            "Hamburg",
            "Senior Web Unicorn"
        )
    );
    JSONObject obj = person.toJSON();

    assertEquals("foobar", obj.getString("id"));
    assertEquals("comment", obj.getString("comment"));
    assertEquals("Fooberius", obj.getString("firstName"));
    assertEquals("Barblub", obj.getString("lastName"));
    assertEquals("+49 666 666", obj.getString("phone"));
    assertEquals("Senior Web Unicorn", obj.getString("title"));
    assertEquals("Hamburg", obj.getString("location"));
    assertEquals("fooberius.barblub@sinnerschrader.com", obj.getString("mail"));
    assertEquals("skillname", obj.getJSONArray("skills").getJSONObject(0).getString("name"));
    assertEquals(2, obj.getJSONArray("skills").getJSONObject(0).getInt("skillLevel"));
    assertEquals(3, obj.getJSONArray("skills").getJSONObject(0).getInt("willLevel"));
  }

  @Test
  public void testToJsonCommentEmpty() {
    // If set to empty string or null, the comment will not be included in the JSON
    person.setComment("");
    assertFalse(person.toJSON().has("comment"));
  }

}
