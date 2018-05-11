package com.sinnerschrader.skillwill.repositories;

import com.sinnerschrader.skillwill.domain.skills.Skill;
import java.util.Collection;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

/**
 * Repository for skills
 * Collection: knownSkill
 *
 * @author torree
 */
public interface SkillRepository extends MongoRepository<Skill, String> {

  @Query("{ 'hidden' : false }")
  List<Skill> findAllExcludeHidden();

  Skill findByName(String name);

  List<Skill> findByNameIn(Collection<String> names);

  @Query("{ 'suggestions.name' : '?0' }")
  List<Skill> findBySuggestion(String suggestion);

  @Query("{ 'subSkillNames' : '?0' }")
  List<Skill> findBySubskillName(String subskillName);

  Skill findByNameStem(String name);

  List<Skill> findByNameStemLike(String name);

}
