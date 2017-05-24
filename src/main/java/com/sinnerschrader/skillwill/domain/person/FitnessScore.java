package com.sinnerschrader.skillwill.domain.person;

import com.sinnerschrader.skillwill.domain.skills.KnownSkill;
import com.sinnerschrader.skillwill.domain.skills.PersonalSkill;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Calculate how well a person fits into a searched skill set.
 * The result can be on a scale from 0 (does not fit at all) to 1 (perfect match)
 *
 * @author torree
 */
public class FitnessScore {

  private final FitnessScoreProperties props;
  private final Person person;
  private final Collection<KnownSkill> searchedSkills;
  private final double value;

  public FitnessScore(Person person, Collection<KnownSkill> searchedSkills, FitnessScoreProperties props) {
    this.person = person;
    this.searchedSkills = searchedSkills;
    this.props = props;
    this.value = (double) Math.round(calculateValue() * 10000) / 10000;
  }

  public double getValue() {
    return this.value;
  }

  private Set<String> getSearchedSkillNames(Collection<KnownSkill> searchedSkills) {
    return searchedSkills.stream().map(KnownSkill::getName).collect(Collectors.toSet());
  }

  private Set<PersonalSkill> getSearchedPersonalSkills() {
    return this.person.getSkillsExcludeHidden().stream()
        .filter(s -> getSearchedSkillNames(this.searchedSkills).contains(s.getName()))
        .collect(Collectors.toSet());
  }

  private Set<PersonalSkill> getUnsearchedPersonalSkills() {
    HashSet<PersonalSkill> skillset = new HashSet<>(this.person.getSkillsExcludeHidden());
    skillset.removeAll(getSearchedPersonalSkills());
    return skillset;
  }

  private double getAverageSkillLevelSearched() {
    return getSearchedPersonalSkills().stream()
        .mapToInt(PersonalSkill::getSkillLevel)
        .average()
        .orElse(0);
  }

  private double getAverageWillLevelSearched() {
    return getSearchedPersonalSkills().stream()
        .mapToInt(PersonalSkill::getWillLevel)
        .average()
        .orElse(0);
  }

  private double getAverageSkillLevelUnsearched() {
    return getUnsearchedPersonalSkills().stream()
        .mapToInt(PersonalSkill::getSkillLevel)
        .average()
        .orElse(0);
  }

  private double getAverageWillLevelUnsearched() {
    return this.getUnsearchedPersonalSkills().stream()
        .mapToInt(PersonalSkill::getWillLevel)
        .average()
        .orElse(0);
  }

  private double getSpecializationSkills() {
    return (props.getMaxLevelValue() + getAverageSkillLevelSearched() - getAverageSkillLevelUnsearched())
        / (2 * props.getMaxLevelValue());
  }

  private double getSpecializationWills() {
    return (props.getMaxLevelValue() + getAverageWillLevelSearched() - getAverageWillLevelUnsearched())
        / (2 * props.getMaxLevelValue());
  }

  private double calculateValue() {
    return (props.getWeightAverageSkills() * getAverageSkillLevelSearched()) / props.getMaxLevelValue() +
        (props.getWeightAverageWills() * getAverageWillLevelSearched()) / props.getMaxLevelValue() +
        (props.getWeightSpecializationSkills() * getSpecializationSkills()) +
        (props.getWeightSpecializationWills() * getSpecializationWills());
  }

}