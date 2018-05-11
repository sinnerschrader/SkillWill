package com.sinnerschrader.skillwill.controllers;

import com.sinnerschrader.skillwill.domain.skills.SkillSearchResult;
import com.sinnerschrader.skillwill.domain.user.Role;
import com.sinnerschrader.skillwill.domain.user.User;
import com.sinnerschrader.skillwill.exceptions.UserNotFoundException;
import com.sinnerschrader.skillwill.misc.StatusResponseEntity;
import com.sinnerschrader.skillwill.services.SessionService;
import com.sinnerschrader.skillwill.services.SkillService;
import com.sinnerschrader.skillwill.services.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
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
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

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

  private final UserService userService;

  private final SkillService skillService;

  private final SessionService sessionService;

  @Autowired
  public UserController(UserService userService, SkillService skillService, SessionService sessionService) {
    this.userService = userService;
    this.skillService = skillService;
    this.sessionService = sessionService;
  }

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
    @ApiImplicitParam(name = "company", value = "Company to filter results by", paramType = "query", required = false),
  })
  @RequestMapping(path = "/users", method = RequestMethod.GET)
  public ResponseEntity<String> getUsers(@RequestParam(required = false) String skills,
    @RequestParam(required = false) String company,
    @RequestParam(required = false) String location) {

    var skillSearchNames = StringUtils.isEmpty(skills)
      ? new ArrayList<String>()
      : Arrays.asList(skills.split(","));
    var searchResult = skillService.searchSkillsByNames(skillSearchNames, true);
    var foundUsers = userService.getUsers(searchResult, company, location);

    var json = new JSONObject();
    json.put("results", new JSONArray(foundUsers.stream().map(User::toJSON).collect(Collectors.toList())));
    json.put("searched", searchResult == null ? new JSONArray() : searchResult.mappingJson());

    skillService.registerSkillSearch(searchResult.mappedSkills());
    return new ResponseEntity<>(json.toString(), HttpStatus.OK);
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
  @RequestMapping(path = "/users/{username}", method = RequestMethod.GET)
  public ResponseEntity<String> getUser(@PathVariable String username) {
    try {
      var user = userService.getUser(username);
      return new ResponseEntity<>(user.toJSON().toString(), HttpStatus.OK);
    } catch (UserNotFoundException e) {
      return new StatusResponseEntity("user not found", HttpStatus.NOT_FOUND);
    }
  }

  /**
   * modify users's skills
   */
  @ApiOperation(value = "modify skill", nickname = "modify skills", notes = "Create or edit a skill of a user")
  @ApiResponses({
    @ApiResponse(code = 200, message = "Success"),
    @ApiResponse(code = 400, message = "Bad Request"),
    @ApiResponse(code = 403, message = "Forbidden"),
    @ApiResponse(code = 404, message = "Not Found"),
    @ApiResponse(code = 500, message = "Failure")
  })
  @ApiImplicitParams({
    @ApiImplicitParam(name = "_oauth2_proxy", value = "session token of the current user", paramType = "cookie", required = true),
    @ApiImplicitParam(name = "skill", value = "Name of skill", paramType = "form", required = true),
    @ApiImplicitParam(name = "skill_level", value = "Level of skill", paramType = "form", required = true),
    @ApiImplicitParam(name = "will_level", value = "Level of will", paramType = "form", required = true),
    @ApiImplicitParam(name = "mentor", value = "Mentor flag", paramType = "form", required = true, dataType = "Boolean")
  })
  @RequestMapping(path = "/users/{user}/skills", method = RequestMethod.POST)
  public ResponseEntity<String> updateSkills(@PathVariable String user,
    @RequestParam("skill") String skill, @RequestParam("skill_level") String skill_level,
    @RequestParam("will_level") String will_level, @RequestParam("mentor") boolean mentor, @CookieValue("_oauth2_proxy") String oAuthToken) {

    if (!sessionService.checkToken(oAuthToken, user)) {
      logger.debug("Failed to modify {}'s skills: not logged in", user);
      return new StatusResponseEntity("user not logged in", HttpStatus.FORBIDDEN);
    }

    try {
      userService.updateSkills(user, skill, Integer.parseInt(skill_level), Integer.parseInt(will_level), mentor);
      return new StatusResponseEntity("success", HttpStatus.OK);
    } catch (UserNotFoundException e) {
      return new StatusResponseEntity("user not found", HttpStatus.NOT_FOUND);
    } catch (IllegalArgumentException e) {
      return new StatusResponseEntity("invalid request", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * delete user's skill
   */
  @ApiOperation(value = "remove skill", nickname = "remove skills", notes = "remove a skill from a user")
  @ApiResponses({
    @ApiResponse(code = 200, message = "Success"),
    @ApiResponse(code = 400, message = "Bad Request"),
    @ApiResponse(code = 403, message = "Forbidden"),
    @ApiResponse(code = 404, message = "Not Found"),
    @ApiResponse(code = 500, message = "Failure")
  })
  @ApiImplicitParams({
    @ApiImplicitParam(name = "_oauth2_proxy", value = "session token of the current user", paramType = "cookie", required = true),
    @ApiImplicitParam(name = "skill", value = "Name of skill", paramType = "query", required = true),
  })
  @RequestMapping(path = "/users/{user}/skills", method = RequestMethod.DELETE)
  public ResponseEntity<String> removeSkill(@PathVariable String user,
    @RequestParam("skill") String skill, @CookieValue("_oauth2_proxy") String oAuthToken) {

    if (!sessionService.checkToken(oAuthToken, user)) {
      logger.debug("Failed to modify {}'s skills: not logged in", user);
      return new StatusResponseEntity("user not logged in", HttpStatus.FORBIDDEN);
    }

    try {
      userService.removeSkills(user, skill);
      logger.info("Successfully deleted {}'s skill {}", user, skill);
      return new StatusResponseEntity("success", HttpStatus.OK);
    } catch (UserNotFoundException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (IllegalArgumentException e) {
      return new StatusResponseEntity("invalid request", HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * Add or update user's role
   */
  @ApiOperation(value = "update role", nickname = "edit user's role", notes = "edit the role of a user")
  @ApiResponses({
    @ApiResponse(code = 200, message = "Success"),
    @ApiResponse(code = 400, message = "Bad Request"),
    @ApiResponse(code = 403, message = "Forbidden"),
    @ApiResponse(code = 404, message = "Not Found"),
    @ApiResponse(code = 500, message = "Failure")
  })
  @ApiImplicitParams({
    @ApiImplicitParam(name = "_oauth2_proxy", value = "session token of the current user", paramType = "cookie", required = true),
    @ApiImplicitParam(name = "role", value = "new role (USER or ADMIN)", paramType = "query", required = true)
  })
  @RequestMapping(path = "/users/{user}/role", method = RequestMethod.POST)
  public ResponseEntity<String> updateRole(@PathVariable String user,
    @CookieValue("_oauth2_proxy") String oAuthToken,
    @RequestParam(value = "role") String role) {

    if (!sessionService.checkTokenRole(oAuthToken, Role.ADMIN)) {
      logger.debug("Failed to edit {}'s role: forbidden operation for current user", user);
      return new StatusResponseEntity("user not logged in or not admin", HttpStatus.FORBIDDEN);
    }

    try {
      userService.updateRole(user, role);
      logger.info("Successfully set {}'s role to {}", user, role);
    } catch (UserNotFoundException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (IllegalArgumentException e) {
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    return new StatusResponseEntity("success", HttpStatus.OK);
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
    @RequestParam(value = "count", required = false) Integer count) {

    List<User> similar;

    try {
      similar = userService.getSimilar(user, count);
    } catch (UserNotFoundException e) {
      logger.debug("Failed to get users similar to {}: user not found", user);
      return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
    } catch (IllegalArgumentException e) {
      logger.debug("Failed to get users similar to {}: illegal parameter", user);
      return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    JSONArray arr = new JSONArray(similar.stream().map(User::toJSON).collect(Collectors.toList()));
    logger.debug("Successfully found {} users similar to {}", arr.length(), user);
    return new ResponseEntity<>(arr.toString(), HttpStatus.OK);
  }

}
