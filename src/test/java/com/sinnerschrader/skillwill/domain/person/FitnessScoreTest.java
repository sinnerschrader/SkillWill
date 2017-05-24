package com.sinnerschrader.skillwill.domain.person;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import com.sinnerschrader.skillwill.domain.skills.KnownSkill;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;
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
    Person person = new Person("foobar");
    person.addUpdateSkill("Java", 3, 3, false);
    person.addUpdateSkill("AEM", 3, 3, false);

    Collection<KnownSkill> searchItems = new ArrayList<>();
    searchItems.add(new KnownSkill("Java", "javaicon"));
    searchItems.add(new KnownSkill("AEM", "aemicon"));
    assertEquals(1.0, new FitnessScore(person, searchItems, fitnessScoreProperties).getValue(), 0);
  }

  @Test
  public void testNoSearchedSkills() {
    Person person = new Person("foobar");
    person.addUpdateSkill("Java", 3, 3, false);
    person.addUpdateSkill("AEM", 3, 3, false);

    Collection<KnownSkill> searchItems = new ArrayList<>();
    searchItems.add(new KnownSkill("Ruby", "rubyicon"));
    assertEquals(0.0, new FitnessScore(person, searchItems, fitnessScoreProperties).getValue(), 0);
  }

  @Test
  public void testMaximumScore() {
    Person person = new Person("foobar");
    person.addUpdateSkill("Java", 3, 3, false);
    person.addUpdateSkill("AEM", 3, 3, false);
    person.addUpdateSkill("Foo", 0, 0, false);
    person.addUpdateSkill("Bar", 0, 0, false);

    Collection<KnownSkill> searchItems = new ArrayList<>();
    searchItems.add(new KnownSkill("Java", "javaicon"));
    searchItems.add(new KnownSkill("AEM", "aemicon"));
    assertEquals(1.0, new FitnessScore(person, searchItems, fitnessScoreProperties).getValue(), 0);
  }

  @Test
  public void testMinimalScore() {
    Person person = new Person("foobar");
    person.addUpdateSkill("Java", 0, 0, false);
    person.addUpdateSkill("AEM", 0, 0, false);
    person.addUpdateSkill("Foo", 3, 3, false);
    person.addUpdateSkill("Bar", 3, 3, false);

    Collection<KnownSkill> searchItems = new ArrayList<>();
    searchItems.add(new KnownSkill("Java", "javaicon"));
    searchItems.add(new KnownSkill("AEM", "aemicon"));
    assertEquals(0.0, new FitnessScore(person, searchItems, fitnessScoreProperties).getValue(), 0);
  }

  @Test
  public void testRealisticScore() {
    Person person = new Person("foobar");
    person.addUpdateSkill("Java", 2, 3, false);
    person.addUpdateSkill("AEM", 2, 2, false);
    person.addUpdateSkill("Foo", 1, 3, false);
    person.addUpdateSkill("Bar", 1, 0, false);

    Collection<KnownSkill> searchItems = new ArrayList<>();
    searchItems.add(new KnownSkill("Java", "javaicon"));
    searchItems.add(new KnownSkill("AEM", "aemicon"));
    searchItems.add(new KnownSkill("Bar", "baricon"));
    assertEquals(0.5278, new FitnessScore(person, searchItems, fitnessScoreProperties).getValue(), 0);
  }

}
