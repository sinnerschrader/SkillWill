package com.sinnerschrader.skillwill.controllers;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import io.swagger.annotations.ApiOperation;


/**
 * Forward / to /swagger-ui.html
 *
 * @author torree
 */
@Controller
@Scope("prototype")
public class ForwardController {

	@ApiOperation(value = "forward frontend to index", notes = "forward routes handled by react-router to index")
	@RequestMapping(path = { "/my-profile/", "/profile/{user}" })
	public String forwardIndex() {
		return "forward:/";
	}

	@ApiOperation(value = "forward to swagger", notes = "forward to swagger")
	@RequestMapping(path = "/swagger")
	public String forwardSwagger() {
		return "forward:/swagger-ui.html";
	}

}
