package com.sinnerschrader.skillwill.mock;

import com.sinnerschrader.skillwill.misc.StatusResponseEntity;
import com.sinnerschrader.skillwill.repositories.UserRepository;
import com.sinnerschrader.skillwill.services.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Scope;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@CrossOrigin
@Scope("prototype")
public class OAuthMock {

  @Value("${mockOAuth}")
  private String mockOAuth;

  private final SessionService sessionService;

  private final UserRepository userRepository;

  @Autowired
  public OAuthMock(SessionService sessionService, UserRepository userRepository) {
    this.sessionService = sessionService;
    this.userRepository = userRepository;
  }

  @RequestMapping(path = "/oauthmock", method = RequestMethod.GET)
  public ResponseEntity<String> getOAuthMock(@CookieValue("_oauth2_proxy") String oAuthToken) {
    if (StringUtils.isEmpty(mockOAuth) || !mockOAuth.equals("true")) {
      return new StatusResponseEntity("oauth mock disabled", HttpStatus.LOCKED);
    }

    if (userRepository.findByMail(sessionService.extractMail(oAuthToken)) != null) {
      return new StatusResponseEntity("success", HttpStatus.ACCEPTED);
    }

    return new StatusResponseEntity("authentication failed", HttpStatus.FORBIDDEN);
  }

}
