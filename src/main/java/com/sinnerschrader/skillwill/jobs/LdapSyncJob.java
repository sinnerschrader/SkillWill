package com.sinnerschrader.skillwill.jobs;

import com.sinnerschrader.skillwill.repositories.UserRepository;
import com.sinnerschrader.skillwill.services.LdapService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Scheduled runner syncing all users with the LDAP
 *
 * @author torree
 */
@Service
@EnableScheduling
public class LdapSyncJob {

  private static final Logger logger = LoggerFactory.getLogger(LdapSyncJob.class);

  private final LdapService ldapService;

  private final UserRepository UserRepository;

  @Autowired
  public LdapSyncJob(LdapService ldapService, UserRepository UserRepository) {
    this.ldapService = ldapService;
    this.UserRepository = UserRepository;
  }

  @Scheduled(cron = "${ldapSyncCron}")
  public void run() {
    logger.info("Starting regular LDAP sync, this may take a while");
    ldapService.syncUsers(UserRepository.findAll(), true);
    logger.info("Finished regular LDAP sync");
  }

}
