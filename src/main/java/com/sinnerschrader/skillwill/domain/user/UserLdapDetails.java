package com.sinnerschrader.skillwill.domain.user;

import java.util.Objects;

/**
 * Data Structure for Details from LDAP.
 *
 * @author torree
 */
public class UserLdapDetails {

  private final String firstName;

  private final String lastName;

  private final String mail;

  private final String phone;

  private final String location;

  private final String title;

  private final String company;

  public UserLdapDetails(String firstName, String lastName, String mail, String phone,
      String location, String title, String company) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.mail = mail;
    this.phone = phone;
    this.location = location;
    this.title = title;
    this.company = company;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public String getMail() {
    return mail;
  }

  public String getPhone() {
    return phone;
  }

  public String getLocation() {
    return location;
  }

  public String getTitle() {
    return title;
  }

  public String getCompany() {
    return this.company;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UserLdapDetails that = (UserLdapDetails) o;
    return Objects.equals(firstName, that.firstName) &&
      Objects.equals(lastName, that.lastName) &&
      Objects.equals(mail, that.mail) &&
      Objects.equals(phone, that.phone) &&
      Objects.equals(location, that.location) &&
      Objects.equals(title, that.title) &&
      Objects.equals(company, that.company);
  }

  @Override
  public int hashCode() {
    return Objects.hash(firstName, lastName, mail, phone, location, title, company);
  }

}
