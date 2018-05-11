package com.sinnerschrader.skillwill.domain.person;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import com.sinnerschrader.skillwill.domain.skills.Skill;
import com.sinnerschrader.skillwill.domain.user.FitnessScore;
import com.sinnerschrader.skillwill.domain.user.FitnessScoreProperties;
import com.sinnerschrader.skillwill.domain.user.User;
import java.util.ArrayList;
import java.util.Collection;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Partial unit tests for FitnessScore
 *
 * @author torree
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class FitnessScoreTest {

  @Autowired
  private FitnessScoreProperties fitnessScoreProperties;

  @Test
  public void testSearchedSkillsOnly() {
    var user = new User("foobar");
    user.addUpdateSkill("Java", 3, 3, false, false);
    user.addUpdateSkill("AEM", 3, 3, false, false);

    Collection<Skill> searchItems = new ArrayList<>();
    searchItems.add(new Skill("Java"));
    searchItems.add(new Skill("AEM"));
    assertEquals(1.0, new FitnessScore(user, searchItems, fitnessScoreProperties).getValue(), 0);
  }

  @Test
  public void testNoSearchedSkills() {
    var user = new User("foobar");
    user.addUpdateSkill("Java", 3, 3, false, false);
    user.addUpdateSkill("AEM", 3, 3, false, false);

    Collection<Skill> searchItems = new ArrayList<>();
    searchItems.add(new Skill("Ruby"));
    assertEquals(0.0, new FitnessScore(user, searchItems, fitnessScoreProperties).getValue(), 0);
  }

  @Test
  public void testMaximumScore() {
    var user = new User("foobar");
    user.addUpdateSkill("Java", 3, 3, false, false);
    user.addUpdateSkill("AEM", 3, 3, false, false);
    user.addUpdateSkill("Foo", 0, 0, false, false);
    user.addUpdateSkill("Bar", 0, 0, false, false);

    Collection<Skill> searchItems = new ArrayList<>();
    searchItems.add(new Skill("Java"));
    searchItems.add(new Skill("AEM"));
    assertEquals(1.0, new FitnessScore(user, searchItems, fitnessScoreProperties).getValue(), 0);
  }

  @Test
  public void testMinimalScore() {
    var user = new User("foobar");
    user.addUpdateSkill("Java", 0, 0, false, false);
    user.addUpdateSkill("AEM", 0, 0, false, false);
    user.addUpdateSkill("Foo", 3, 3, false, false);
    user.addUpdateSkill("Bar", 3, 3, false, false);

    Collection<Skill> searchItems = new ArrayList<>();
    searchItems.add(new Skill("Java"));
    searchItems.add(new Skill("AEM"));
    assertEquals(0.0, new FitnessScore(user, searchItems, fitnessScoreProperties).getValue(), 0);
  }

  @Test
  public void testRealisticScore() {
    var user = new User("foobar");
    user.addUpdateSkill("Java", 2, 3, false, false);
    user.addUpdateSkill("AEM", 2, 2, false, false);
    user.addUpdateSkill("Foo", 1, 3, false, false);
    user.addUpdateSkill("Bar", 1, 0, false, false);

    Collection<Skill> searchItems = new ArrayList<>();
    searchItems.add(new Skill("Java"));
    searchItems.add(new Skill("AEM"));
    searchItems.add(new Skill("Bar"));
    assertEquals(0.5278, new FitnessScore(user, searchItems, fitnessScoreProperties).getValue(), 0);
  }

}
