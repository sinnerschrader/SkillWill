package com.sinnerschrader.skillwill.jobs;

import com.sinnerschrader.skillwill.services.SessionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Scheduled runner cleaning up old sessions
 *
 * @author torree
 */
@Service
@EnableScheduling
public class SessionCleanupJob {

  private static final Logger logger = LoggerFactory.getLogger(SessionCleanupJob.class);

  private final SessionService sessionService;

  @Autowired
  public SessionCleanupJob(SessionService sessionService) {
    this.sessionService = sessionService;
  }

  @Scheduled(cron = "${sessionCleanUpCron}")
  private void run() {
    logger.info("Starting regular session cleanup, this may take a while");
    sessionService.cleanUp();
    logger.info("Finished regular session cleanup");
  }

}
