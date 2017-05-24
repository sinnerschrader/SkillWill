package com.sinnerschrader.skillwill.misc;

import com.sinnerschrader.skillwill.domain.person.Person;
import com.sinnerschrader.skillwill.domain.skills.KnownSkill;
import com.sinnerschrader.skillwill.domain.skills.PersonalSkill;
import com.sinnerschrader.skillwill.repositories.PersonRepository;
import com.sinnerschrader.skillwill.repositories.SkillRepository;
import java.util.HashMap;
import java.util.IntSummaryStatistics;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.info.Info;
import org.springframework.boot.actuate.info.InfoContributor;
import org.springframework.stereotype.Component;

@Component
public class StatisticsInfoContributor implements InfoContributor {

  @Autowired
  private PersonRepository personRepository;

  @Autowired
  private SkillRepository skillRepository;

  private void contributeUserCount(Info.Builder builder) {
    builder.withDetail("users_total", personRepository.count());
  }

  private void contributeSkillCount(Info.Builder builder) {
    builder.withDetail("skills_total", skillRepository.count());
  }

  private void contributeUsedSkillCount(List<Person> users, Info.Builder builder) {
    int usedSkillCount = (int) users.stream()
      .flatMap(p -> p.getSkillsExcludeHidden().stream())
      .map(PersonalSkill::getName)
      .distinct()
      .count();
    builder.withDetail("skills_used", usedSkillCount);
  }

  private void contributeHiddenSkillCount(Info.Builder builder) {
    builder.withDetail("skills_hidden", skillRepository.findAll().stream().filter(KnownSkill::isHidden).count());
  }

  private void contributeUserSkills(List<Person> users, Info.Builder builder) {
    IntSummaryStatistics stats = users.stream().mapToInt(u -> u.getSkillsExcludeHidden().size()).summaryStatistics();

    Map<String, Double> details = new HashMap<>();
    details.put("total", (double) stats.getSum());
    details.put("min", (double) stats.getMin());
    details.put("max", (double) stats.getMax());
    details.put("average", stats.getAverage());

    builder.withDetail("personal_skills", details);
  }

  @Override
  public void contribute(Info.Builder builder) {
    List<Person> users = personRepository.findAll();

    contributeUserCount(builder);
    contributeSkillCount(builder);
    contributeUsedSkillCount(users, builder);
    contributeHiddenSkillCount(builder);
    contributeUserSkills(users, builder);
  }

}
