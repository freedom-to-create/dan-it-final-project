package com.danit.finalproject.application.validation;

import com.danit.finalproject.application.entity.User;
import com.danit.finalproject.application.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class TokenNotExpiredConstraintValidator implements ConstraintValidator<TokenNotExpired, String> {

  private UserService userService;

  @Autowired
  public TokenNotExpiredConstraintValidator(UserService userService) {
    this.userService = userService;
  }

  public void initialize(TokenNotExpired constraint) {
  }

  public boolean isValid(String token, ConstraintValidatorContext context) {
    User user = userService.getUserByToken(token);
    return System.currentTimeMillis() <= user.getTokenExpirationDate().getTime();
  }
}
