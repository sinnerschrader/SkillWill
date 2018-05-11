package com.sinnerschrader.skillwill.domain.user;

import com.sinnerschrader.skillwill.domain.skills.Skill;
import com.sinnerschrader.skillwill.domain.skills.UserSkill;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Calculate how well a user fits into a searched skill set.
 * The result can be on a scale from 0 (does not fit at all) to 1 (perfect match)
 *
 * @author torree
 */
public class FitnessScore {

  private final FitnessScoreProperties props;

  private final User user;

  private final Collection<Skill> searchedSkills;

  private final double value;

  public FitnessScore(User user, Collection<Skill> searchedSkills, FitnessScoreProperties props) {
    this.user = user;
    this.searchedSkills = searchedSkills;
    this.props = props;
    this.value = (double) Math.round(calculateValue() * 10000) / 10000;
  }

  public double getValue() {
    return this.value;
  }

  private Set<String> getSearchedSkillNames(Collection<Skill> searchedSkills) {
    return searchedSkills.stream().map(Skill::getName).collect(Collectors.toSet());
  }

  private Set<UserSkill> getSearchedPersonalSkills() {
    return this.user.getSkills(true).stream()
        .filter(s -> getSearchedSkillNames(this.searchedSkills).contains(s.getName()))
        .collect(Collectors.toSet());
  }

  private Set<UserSkill> getUnsearchedPersonalSkills() {
    var skillset = new HashSet<>(this.user.getSkills(true));
    skillset.removeAll(getSearchedPersonalSkills());
    return skillset;
  }

  private double getAverageSkillLevelSearched() {
    return getSearchedPersonalSkills().stream()
        .mapToInt(UserSkill::getSkillLevel)
        .average()
        .orElse(0);
  }

  private double getAverageWillLevelSearched() {
    return getSearchedPersonalSkills().stream()
        .mapToInt(UserSkill::getWillLevel)
        .average()
        .orElse(0);
  }

  private double getAverageSkillLevelUnsearched() {
    return getUnsearchedPersonalSkills().stream()
        .mapToInt(UserSkill::getSkillLevel)
        .average()
        .orElse(0);
  }

  private double getAverageWillLevelUnsearched() {
    return this.getUnsearchedPersonalSkills().stream()
        .mapToInt(UserSkill::getWillLevel)
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
