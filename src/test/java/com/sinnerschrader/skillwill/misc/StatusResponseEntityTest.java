package com.sinnerschrader.skillwill.misc;

import static org.junit.Assert.assertEquals;

import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

/**
 * Unit tests for StatusJson
 *
 * @author torree
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringBootTest
public class StatusResponseEntityTest {

  @Test
  public void testNormalStrings() throws JSONException {
    var response = new StatusResponseEntity("foo", HttpStatus.OK);
    assertEquals("foo", extractMessage(response));
  }

  @Test
  public void testEmptyStrings() throws JSONException {
    var response = new StatusResponseEntity("", HttpStatus.OK);
    assertEquals("", extractMessage(response));
  }

  @Test
  public void testUnicodeMessage() throws JSONException {
    var response = new StatusResponseEntity("\uD83D\uDCA9", HttpStatus.OK);
    assertEquals("\uD83D\uDCA9", extractMessage(response));
  }

  private String extractMessage(ResponseEntity entity) throws JSONException {
    return new JSONObject(entity.getBody().toString()).getString("message");
  }

}
