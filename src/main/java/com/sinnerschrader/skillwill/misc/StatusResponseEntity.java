package com.sinnerschrader.skillwill.misc;

import org.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

/**
 * Little helper class encapsulating status JSON
 * that will be returned in case of errors
 *
 * @author torree
 */
public class StatusResponseEntity extends ResponseEntity<String> {

  public StatusResponseEntity(String message, HttpStatus status) {
    super(messageToJsonString(message), status);
  }

  private static String messageToJsonString(String message) {
    var json = new JSONObject();
    json.put("message", message);
    return json.toString();
  }

}
