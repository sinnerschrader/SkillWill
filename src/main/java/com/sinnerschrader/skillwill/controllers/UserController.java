package com.sinnerschrader.skillwill.controllers;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.sinnerschrader.skillwill.domain.person.FitnessScoreProperties;
import com.sinnerschrader.skillwill.domain.person.Person;
import com.sinnerschrader.skillwill.domain.skills.KnownSkill;
import com.sinnerschrader.skillwill.exceptions.EmptyArgumentException;
import com.sinnerschrader.skillwill.exceptions.UserNotFoundException;
import com.sinnerschrader.skillwill.misc.StatusJSON;
import com.sinnerschrader.skillwill.services.SessionService;
import com.sinnerschrader.skillwill.services.SkillService;
import com.sinnerschrader.skillwill.services.UserService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

/**
 * Controller handling /users/{foo}
 *
 * @author torree
 */
@Api(tags = "Users", description = "User management and search")
@Controller
@CrossOrigin
@Scope("prototype")
public class UserController {

  private static final Logger logger = LoggerFactory.getLogger(UserController.class);

  @Autowired
  private UserService userService;

  @Autowired
  private SkillService skillService;

  @Autowired
  private SessionService sessionService;

  @Autowired
  private FitnessScoreProperties fitnessScoreProperties;

  /**
   * Search for users with specific skills / list all users if no search query is specified
   */
  @ApiOperation(value = "search users", nickname = "search users", notes = "Search users.")
  @ApiResponses(value = {
    @ApiResponse(code = 200, message = "Success"),
    @ApiResponse(code = 500, message = "Failure")
  })
  @ApiImplicitParams({
    @ApiImplicitParam(name = "skills", value = "Names of skills to search, separated by ','", paramType = "query", required = false),
    @ApiImplicitParam(name = "location", value = "Location to filter results by", paramType = "query", required = false),
  })
  @RequestMapping(path = "/users", method = RequestMethod.GET)
  public ResponseEntity<String> getUsers(@RequestParam(required = false) String skills,
    @RequestParam(required = false) String location) {

    List<String> skillList = skills != null ? Arrays.asList(skills.split("\\s*,\\s*")) : Collections.emptyList();
    Set<KnownSkill> sanitizedSkills = skillService.getSkillsByStemsExcludeHidden(skillList);
    skillService.registerSkillSearch(sanitizedSkills);

    List<Person> matches = CollectionUtils.isEmpty(sanitizedSkills) && !StringUtils.isEmpty(skills)
      ? new ArrayList<>()
      : userService.getUsers(sanitizedSkills, location);

    JSONObject returnJsonObj = new JSONObject();
    returnJsonObj.put("results", new JSONArray(matches.stream()
      .map(Person::toJSON)
      .collect(Collectors.toList())));
    returnJsonObj.put("searched", new JSONArray(sanitizedSkills.stream()
      .map(KnownSkill::getName)
      .collect(Collectors.toList())));
    return new ResponseEntity<>(returnJsonObj.toString(), HttpStatus.OK);
  }


  /**
   * Get a user
   */
  @ApiOperation(value = "get info", nickname = "user info", notes = "Returns the user with the given id")
  @ApiResponses(value = {
    @ApiResponse(code = 200, message = "Success"),
    @ApiResponse(code = 404, message = "Not Found"),
    @ApiResponse(code = 500, message = "Failure")
  })
  @RequestMapping(path = "/users/{user}", method = RequestMethod.GET)
  public ResponseEntity<String> getUser(@PathVariable String user) {
    try {
      Person p = userService.getUser(user);
      return new ResponseEntity<>(p.toJSON().toString(), HttpStatus.OK);
    } catch (UserNotFoundException e) {
      StatusJSON json = new StatusJSON("user not found");
      return new ResponseEntity<>(json.toString(), HttpStatus.NOT_FOUND);
    }
  }

  /**
   * modify users's skills
   */
  @ApiOperation(value = "modify skill", nickname = "modify skills", notes = "Create or edit a skill of a user")
  @ApiResponses({
    @ApiResponse(code = 200, message = "Success"),
    @ApiResponse(code = 400, message = "Bad Request"),
    @ApiResponse(code = 401, message = "Unauthorized"),
    @ApiResponse(code = 404, message = "Not Found"),
    @ApiResponse(code = 500, message = "Failure")
  })
  @ApiImplicitParams({
    @ApiImplicitParam(name = "session", value = "users's active session key", paramType = "form", required = true),
    @ApiImplicitParam(name = "skill", value = "Name of skill", paramType = "form", required = true),
    @ApiImplicitParam(name = "skill_level", value = "Level of skill", paramType = "form", required = true),
    @ApiImplicitParam(name = "will_level", value = "Level of will", paramType = "form", required = true)
  })
  @RequestMapping(path = "/users/{user}/skills", method = RequestMethod.POST)
  public ResponseEntity<String> updateSkills(@PathVariable String user,
    @RequestParam("skill") String skill, @RequestParam("skill_level") String skill_level,
    @RequestParam("will_level") String will_level, @RequestParam("session") String sessionKey) {

    if (!sessionService.isValidSession(user, sessionKey)) {
      logger.debug("Failed to modify {}'s skills: not logged in", user);
      return new ResponseEntity<>(new StatusJSON("user not logged in").toString(), HttpStatus.UNAUTHORIZED);
    }

    try {
      userService.updateSkills(user, skill, Integer.parseInt(skill_level), Integer.parseInt(will_level));
      return new ResponseEntity<>(new StatusJSON("success").toString(), HttpStatus.OK);
    } catch (UserNotFoundException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (IllegalArgumentException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * delete user's skill
   */
  @ApiOperation(value = "remove skill", nickname = "remove skills", notes = "remove a skill from a user")
  @ApiResponses({
    @ApiResponse(code = 200, message = "Success"),
    @ApiResponse(code = 400, message = "Bad Request"),
    @ApiResponse(code = 401, message = "Unauthorized"),
    @ApiResponse(code = 404, message = "Not Found"),
    @ApiResponse(code = 500, message = "Failure")
  })
  @ApiImplicitParams({
    @ApiImplicitParam(name = "session", value = "users's active session key", paramType = "query", required = true),
    @ApiImplicitParam(name = "skill", value = "Name of skill", paramType = "query", required = true),
  })
  @RequestMapping(path = "/users/{user}/skills", method = RequestMethod.DELETE)
  public ResponseEntity<String> removeSkill(@PathVariable String user,
    @RequestParam("skill") String skill, @RequestParam("session") String sessionKey) {

    if (!sessionService.isValidSession(user, sessionKey)) {
      logger.debug("Failed to modify {}'s skills: not logged in", user);
      return new ResponseEntity<>(new StatusJSON("user not logged in").toString(),
        HttpStatus.UNAUTHORIZED);
    }

    try {
      userService.removeSkills(user, skill);
      logger.info("Successfully deleted {}'s skill {}", user, skill);
      return new ResponseEntity<>(new StatusJSON("success").toString(), HttpStatus.OK);
    } catch (UserNotFoundException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (IllegalArgumentException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Add or update user's details
   */
  @ApiOperation(value = "update details", nickname = "edit user's details", notes = "edit only the non-LDAP details of a user")
  @ApiResponses({
    @ApiResponse(code = 200, message = "Success"),
    @ApiResponse(code = 400, message = "Bad Request"),
    @ApiResponse(code = 401, message = "Unauthorized"),
    @ApiResponse(code = 404, message = "Not Found"),
    @ApiResponse(code = 500, message = "Failure")
  })
  @ApiImplicitParams({
    @ApiImplicitParam(name = "session", value = "users's active session key", paramType = "query", required = true),
    @ApiImplicitParam(name = "comment", value = "new comment", paramType = "query"),
  })
  @RequestMapping(path = "/users/{user}/details", method = RequestMethod.PUT)
  public ResponseEntity<String> updateDetails(@PathVariable String user,
    @RequestParam("session") String sessionKey,
    @RequestParam(value = "comment", required = false) String comment) {

    if (!sessionService.isValidSession(user, sessionKey)) {
      logger.debug("Failed to modify {}'s details: not logged in", user);
      return new ResponseEntity<>(new StatusJSON("user not logged in").toString(), HttpStatus.UNAUTHORIZED);
    }

    // Comment may be empty string (set to empty) -> no check if empty
    try {
      userService.updateDetails(user, comment);
      logger.info("Successfully updated {}'s comment", user);
    } catch (UserNotFoundException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (EmptyArgumentException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    return new ResponseEntity<>(new StatusJSON("success").toString(), HttpStatus.OK);
  }

  /**
   * Get users with similar skill sets
   */
  @ApiOperation(value = "get similar", nickname = "get similar", notes = "get users with similar skills sets")
  @ApiResponses({
    @ApiResponse(code = 200, message = "Success"),
    @ApiResponse(code = 404, message = "Not Found"),
    @ApiResponse(code = 400, message = "Bad Request"),
    @ApiResponse(code = 500, message = "Failure")
  })
  @ApiImplicitParams({
    @ApiImplicitParam(name = "count", value = "number of users to find (max)", paramType = "query", defaultValue = "10"),
  })
  @RequestMapping(path = "/users/{user}/similar", method = RequestMethod.GET)
  public ResponseEntity<String> getSimilar(@PathVariable String user,
    @RequestParam(value = "count", required = false, defaultValue = "10") int count) {

    List<Person> similar;

    try {
      similar = userService.getSimilar(user, count);
    } catch (UserNotFoundException e) {
      logger.debug("Failed to get users similar to {}: user not found", user);
      return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (IllegalArgumentException e) {
      logger.debug("Failed to get users similar to {}: illegal parameter", user);
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    JSONArray arr = new JSONArray(
      similar.stream().map(Person::toJSON).collect(Collectors.toList()));
    logger.debug("Successfully found {} users similar to {}", arr.length(), user);
    return new ResponseEntity<>(arr.toString(), HttpStatus.OK);
  }

}
