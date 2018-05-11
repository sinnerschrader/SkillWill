package com.sinnerschrader.skillwill.domain.skills;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.List;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class SkillAutocompleteComparatorTest {

  @Test
  public void testNoneStarts() {
    var skillA = new Skill("Wurstwasser");
    var skillB = new Skill("foo");

    var toSort = new ArrayList<Skill>();
    toSort.add(skillA);
    toSort.add(skillB);
    toSort.sort(new SkillAutocompleteComparator("42"));

    assertEquals(skillA, toSort.get(0));
    assertEquals(skillB, toSort.get(1));
  }

  @Test
  public void bothStart() {
    var skillA = new Skill("foobar");
    var skillB = new Skill("foowurst");

    var toSort = new ArrayList<Skill>();
    toSort.add(skillA);
    toSort.add(skillB);
    toSort.sort(new SkillAutocompleteComparator("foo"));

    assertEquals(skillA, toSort.get(0));
    assertEquals(skillB, toSort.get(1));
  }

  @Test
  public void oneStarts() {
    var skillA = new Skill("foobar");
    var skillB = new Skill("wurstwasser");

    var toSort = new ArrayList<Skill>();
    toSort.add(skillA);
    toSort.add(skillB);
    toSort.sort(new SkillAutocompleteComparator("wurst"));

    assertEquals(skillB, toSort.get(0));
    assertEquals(skillA, toSort.get(1));
  }

  @Test
  public void threeElements() {
    var skillA = new Skill("foobar");
    var skillB = new Skill("wurstwasser");
    var skillC = new Skill("bumsdings");

    var toSort = new ArrayList<Skill>();
    toSort.add(skillA);
    toSort.add(skillB);
    toSort.add(skillC);
    toSort.sort(new SkillAutocompleteComparator("wurst"));

    assertEquals(skillB, toSort.get(0));
    assertEquals(skillA, toSort.get(1));
    assertEquals(skillC, toSort.get(2));

  }

}
