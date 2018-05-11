package com.sinnerschrader.skillwill.domain.person;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

import com.sinnerschrader.skillwill.domain.user.Role;
import com.sinnerschrader.skillwill.domain.user.User;
import com.sinnerschrader.skillwill.domain.user.UserLdapDetails;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Partial unit tests for User
 *
 * @author torree
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class UserTest {

  private User user;

  @Before
  public void init() {
    user = new User("foobar");
    user.addUpdateSkill("skillname", 2, 3, false, false);
  }

  @Test
  public void testAddUpdateNewSkill() {
    user.addUpdateSkill("new skill", 2, 3, false, false);
    assertEquals(2, user.getSkills(true).size());
  }

  @Test
  public void testAddUpdateKnownSkill() {
    user.addUpdateSkill("skillname", 0, 1, false, false);
    assertEquals(1, user.getSkills(true).size());
    assertEquals(0, user.getSkills(true).get(0).getSkillLevel());
    assertEquals(1, user.getSkills(true).get(0).getWillLevel());
  }

  @Test
  public void testToJson() throws JSONException {
    user.setRole(Role.ADMIN);
    user.setLdapDetails(
        new UserLdapDetails(
            "Fooberius",
            "Barblub",
            "fooberius.barblub@sinnerschrader.com",
            "+49 666 666",
            "Hamburg",
            "Senior Web Unicorn",
            "Firma"
        )
    );
    JSONObject obj = user.toJSON();

    assertEquals("foobar", obj.getString("id"));
    assertEquals("ADMIN", obj.getString("role"));
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

}
