package com.sinnerschrader.skillwill.repositories;

import com.sinnerschrader.skillwill.domain.user.User;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;


/**
 * MongoRepository for Persons Collection: person
 *
 * @author torree
 */
public interface UserRepository extends MongoRepository<User, String> {

	User findByIdIgnoreCase(String id);

	@Query("{ 'ldapDetails.mail' : '?0' }")
	User findByMail(String mail);

	@Query("{ 'skills._id' : '?0' }")
	List<User> findBySkill(String skillName);

	@Query("{ 'skills._id' : { $all : ?0 } }")
	List<User> findBySkills(List<String> skillNames);

}
