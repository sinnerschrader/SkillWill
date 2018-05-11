package com.sinnerschrader.skillwill.domain.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Wrapper to load weights for fitness Scores
 */
@Component
public class FitnessScoreProperties {

  @Value("${weightAverageSkills}")
  private double weightAverageSkills;

  @Value("${weightAverageWills}")
  private double weightAverageWills;


  @Value("${weightSpecializationSkills}")
  private double weightSpecializationSkills;

  @Value("${weightSpecializationWills}")
  private double weightSpecializationWills;

  @Value("${maxLevelValue}")
  private int maxLevelValue;

  double getWeightAverageSkills() {
    return weightAverageSkills;
  }

  double getWeightAverageWills() {
    return weightAverageWills;
  }

  double getWeightSpecializationSkills() {
    return weightSpecializationSkills;
  }

  double getWeightSpecializationWills() {
    return weightSpecializationWills;
  }

  int getMaxLevelValue() {
    return maxLevelValue;
  }

}
