package com.sinnerschrader.skillwill.services;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.sinnerschrader.skillwill.domain.person.Person;
import com.sinnerschrader.skillwill.domain.skills.KnownSkill;
import com.sinnerschrader.skillwill.domain.skills.KnownSkillSuggestionComparator;
import com.sinnerschrader.skillwill.domain.skills.PersonalSkill;
import com.sinnerschrader.skillwill.domain.skills.SkillStemUtils;
import com.sinnerschrader.skillwill.domain.skills.SuggestionSkill;
import com.sinnerschrader.skillwill.exceptions.DuplicateSkillException;
import com.sinnerschrader.skillwill.exceptions.EmptyArgumentException;
import com.sinnerschrader.skillwill.exceptions.SkillNotFoundException;
import com.sinnerschrader.skillwill.repositories.PersonRepository;
import com.sinnerschrader.skillwill.repositories.SkillRepository;

/**
 * Services handling skills management (create, rename, suggest, delete, ...)
 *
 * @author torree
 */
@Service
@EnableRetry
public class SkillService {

  private static final Logger logger = LoggerFactory.getLogger(SkillService.class);

  @Autowired
  private SkillRepository skillRepository;

  @Autowired
  private PersonRepository personRepository;

  private List<KnownSkill> getAllSkills(Boolean excludeHidden) {
    return excludeHidden ? skillRepository.findAllExcludeHidden() : skillRepository.findAll();
  }

  private List<KnownSkill> getAutocompleteSkills(String input, Boolean excludeHidden) {
    List<KnownSkill> skills = skillRepository.findByNameStemLike(SkillStemUtils.nameToStem(input));
    if (excludeHidden) {
      skills = skills.stream().filter(s -> !s.isHidden()).collect(Collectors.toList());
    }
    skills.sort(new KnownSkillSuggestionComparator(input));
    logger.debug("Successfully got {} autocompletions for : {}", skills.size(), input);
    return skills;
  }

  public List<KnownSkill> getSkills(String search, Boolean excludeHidden) {
    return StringUtils.isEmpty(search) ? getAllSkills(excludeHidden) : getAutocompleteSkills(search, excludeHidden);
  }

  public KnownSkill getSkillByName(String name) {
    return skillRepository.findByName(name);
  }

  public Set<KnownSkill> getSkillsByStemsExcludeHidden(List<String> stems) throws SkillNotFoundException {
    return stems.stream()
      .map(s -> skillRepository.findByNameStem(SkillStemUtils.nameToStem(s)))
      .filter(s -> s != null && !s.isHidden())
      .collect(Collectors.toSet());
  }

  private List<SuggestionSkill> aggregateSuggestions(Collection<KnownSkill> skills) {
    List<SuggestionSkill> unaggregated = skills.stream().flatMap(s -> s.getSuggestions().stream())
      .collect(Collectors.toList());
    List<SuggestionSkill> aggregated = new ArrayList<>();

    for (SuggestionSkill s : unaggregated) {
      Optional<SuggestionSkill> present = aggregated.stream()
        .filter(a -> a.getName().equals(s.getName()))
        .findAny();
      if (present.isPresent()) {
        present.get().incrementCount(s.getCount());
      } else {
        aggregated.add(s);
      }
    }
    return aggregated;
  }

  public List<KnownSkill> getSuggestionSkills(List<String> references, int count) {
    if (count < 1) {
      throw new IllegalArgumentException("count must be a positive integer");
    }

    List<SuggestionSkill> suggestions;
    if (CollectionUtils.isEmpty(references)) {
      suggestions = aggregateSuggestions(skillRepository.findAllExcludeHidden());
    } else {
      Set<KnownSkill> sanitizedReferenceskills = getSkillsByStemsExcludeHidden(references);
      List<String> sanitizedReferenceNames = sanitizedReferenceskills.stream()
        .map(KnownSkill::getName)
        .collect(Collectors.toList());
      suggestions = aggregateSuggestions(sanitizedReferenceskills).stream()
        .filter(s -> !sanitizedReferenceNames.contains(s.getName()))
        .collect(Collectors.toList());
    }

    return suggestions.stream()
      .sorted(Comparator.comparingInt(SuggestionSkill::getCount).reversed())
      .limit(count)
      .map(s -> skillRepository.findByName(s.getName()))
      .filter(s -> !s.isHidden())
      .collect(Collectors.toList());
  }

  @Retryable(include = OptimisticLockingFailureException.class, maxAttempts = 10)
  public void registerSkillSearch(Collection<KnownSkill> searchedSkills) throws IllegalArgumentException {

    if (searchedSkills.size() < 2) {
      logger.debug("Searched for less than two skills, cannot update mutual suggestions");
      return;
    }

    for (KnownSkill s : searchedSkills) {
      List<KnownSkill> ts = searchedSkills.stream().filter(x -> !x.equals(s)).collect(Collectors.toList());
      for (KnownSkill t : ts) {
        s.incrementSuggestion(t.getName());
      }
    }

    skillRepository.save(searchedSkills);
    logger.info("Successfully registered search for {}",
      searchedSkills.stream().map(KnownSkill::getName).collect(Collectors.toList()));
  }

  @Retryable(include = OptimisticLockingFailureException.class, maxAttempts = 10)
  public void createSkill(String name, String iconDescriptor, Boolean isHidden, Set<String> subSkills)
    throws EmptyArgumentException, DuplicateSkillException {

    if (StringUtils.isEmpty(name)) {
      logger.debug("Failed to create skill {}: name is empty", name);
      throw new EmptyArgumentException("name is empty");
    }

    if (skillRepository.findByName(name) != null) {
      logger.debug("Failed to create skill {}: already exists", name);
      throw new DuplicateSkillException("skill already existing");
    }

    // check if subSkills are known
    if (!CollectionUtils.isEmpty(subSkills)) {
      subSkills.stream().forEach(s -> {
        if (skillRepository.findByName(s) == null) {
          logger.debug("Failed to set subskill {} on skill {}: subskill not known", name, s);
          throw new SkillNotFoundException("cannot set subskill " + ": not known");
        }
      });
    }

    try {
      skillRepository.insert(new KnownSkill(name, iconDescriptor, new ArrayList<>(), isHidden, subSkills));
      logger.info("Successfully created skill {}", name);
    } catch (DuplicateKeyException e) {
      logger.debug("Failed to create skill {}: already exists");
      throw new DuplicateSkillException("skill already existing");
    }

  }

  @Retryable(include = OptimisticLockingFailureException.class, maxAttempts = 10)
  public void updateSkill(String name, String newName, String iconDescriptor, Boolean hidden, Set<String> subSkills)
    throws IllegalArgumentException, DuplicateSkillException {

    if (skillRepository.findByName(name) == null) {
      logger.debug("Failed to rename skill {}: not found", name);
      throw new SkillNotFoundException("skill not found");
    }

    if (!name.equals(newName) && skillRepository.findByName(newName) != null) {
      logger.debug("Failed to rename skill {}: new name {} already exists", name, newName);
      throw new DuplicateSkillException("skill already exists");
    }

    // check if subSkills are known
    subSkills.stream().forEach(s -> {
      if (skillRepository.findByName(s) == null) {
        logger.debug("Failed to set subskill {} on skill {}: subskill not known", name, s);
        throw new IllegalArgumentException("cannot set subskill " + ": not known");
      }
    });

    // update in skills Repo
    try {
      KnownSkill skill = skillRepository.findByName(name);
      KnownSkill newSkill = new KnownSkill(
        newName == null ? skill.getName() : newName,
        iconDescriptor == null ? skill.getIconDescriptor() : iconDescriptor,
        skill.getSuggestions(),
        hidden == null ? skill.isHidden() : hidden,
        subSkills == null ? skill.getSubSkillNames() : subSkills
      );

      if (newSkill.equals(skill)) {
        logger.info("Aborted updating skill {}: new values are equal to old skill", name);
        return;
      }

      skillRepository.delete(skill);
      skillRepository.insert(newSkill);
    } catch (DuplicateSkillException e) {
      throw new DuplicateSkillException("skill already exists");
    }

    // set hidden in personal skills
    if (hidden != null) {
      List<Person> updatePersons = personRepository.findBySkill(name);
      updatePersons.forEach(p -> p.getSkill(name).setHidden(hidden));
      personRepository.save(updatePersons);
    }

    // rename in suggestions and persons
    if (!StringUtils.isEmpty(newName) && !name.equals(newName)) {
      renameSkillinPersons(name, newName);
      renameSkillNested(name, newName);
    }

    logger.info("Successfully altered skill {}. set values: {}{}{}{}",
      name,
      StringUtils.isEmpty(newName) ? "" : "name: " + newName + "; ",
      StringUtils.isEmpty(iconDescriptor) ? "" : "iconDescriptor: " + iconDescriptor + "; ",
      hidden == null ? "" : "hidden " + hidden.toString() + "; ",
      CollectionUtils.isEmpty(subSkills) ? "" : "subskills:" + subSkills.toString() + "; "
    );
  }

  @Retryable(include = OptimisticLockingFailureException.class, maxAttempts = 10)
  private void renameSkillNested(String name, String newName) {
    logger.debug("Renaming Skill {} to {} in skill suggestions", name, newName);
    for (KnownSkill knownSkill : skillRepository.findBySuggestion(name)) {
      knownSkill.renameSuggestion(name, newName);
      knownSkill.renameSubSkillName(name, newName);
      skillRepository.save(knownSkill);
    }
  }

  @Retryable(include = OptimisticLockingFailureException.class, maxAttempts = 10)
  private void renameSkillinPersons(String name, String newName) {
    logger.debug("Renaming Skill {} to {} in persons", name, newName);
    for (Person person : personRepository.findBySkill(name)) {
      PersonalSkill oldSkill = person.getSkill(name);
      person.addUpdateSkill(newName, oldSkill.getSkillLevel(), oldSkill.getWillLevel(), oldSkill.isHidden());
      person.deleteSkill(name);
      personRepository.save(person);
    }
  }


  @Retryable(include = OptimisticLockingFailureException.class, maxAttempts = 10)
  public void deleteSkill(String name) {
    if (skillRepository.findByName(name) == null) {
      logger.debug("Failed to delete skill {}: not found", name);
      throw new SkillNotFoundException("skill not found");
    }

    // delete from known skills
    skillRepository.delete(skillRepository.findByName(name));

    // delete in suggestion
    for (KnownSkill knownSkill : skillRepository.findBySuggestion(name)) {
      knownSkill.deleteSuggestion(name);
      skillRepository.save(knownSkill);
    }

    // delete from persons
    for (Person person : personRepository.findBySkill(name)) {
      person.deleteSkill(name);
      personRepository.save(person);
    }

    logger.info("Successfully deleted skill {}", name);
  }

  @Retryable(include = OptimisticLockingFailureException.class, maxAttempts = 10)
  public boolean isHidden(String skillName) {
    KnownSkill skill = skillRepository.findByName(skillName);
    if (skill == null) {
      throw new SkillNotFoundException("skill not found");
    }
    return skill.isHidden();
  }


}
