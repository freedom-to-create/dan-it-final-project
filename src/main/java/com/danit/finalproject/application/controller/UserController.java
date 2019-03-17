package com.danit.finalproject.application.controller;

import com.danit.finalproject.application.dto.request.UpdateUserPasswordRequestDto;
import com.danit.finalproject.application.entity.Role;
import com.danit.finalproject.application.entity.User;
import com.danit.finalproject.application.service.UserService;
import com.danit.finalproject.application.service.ValidationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("api/users")
public class UserController {

  private UserService userService;
  private ValidationService validationService;

  @Autowired
  public UserController(UserService userService, ValidationService validationService) {
    this.userService = userService;
    this.validationService = validationService;
  }

  @GetMapping("{userId}")
  public User getUserById(@PathVariable Long userId) {
    return userService.getUserById(userId);
  }

  @GetMapping
  public List<User> getUsersByEmail(@RequestParam String email) {
    return userService.getUsersByEmail(email);
  }

  @PostMapping
  public User createUser(@RequestBody User user) {
    return userService.createUser(user);
  }

  @PutMapping("{userId}")
  public User updateUser(@PathVariable Long userId, @RequestBody User user) {
    return userService.updateUser(userId, user);
  }

  @DeleteMapping("{userId}")
  public User deleteUser(@PathVariable Long userId) {
    return userService.deleteUser(userId);
  }

  @PutMapping("{userId}/roles")
  public User setUserRoles(@PathVariable Long userId, @RequestBody List<Role> roles) {
    return userService.setUserRoles(userId, roles);
  }

  @PutMapping("forgot-password/token")
  public void generateToken(@RequestParam String email) {
    userService.generateToken(email);
  }

  @PutMapping("forgot-password/update")
  public User updatePassword(@RequestBody @Valid UpdateUserPasswordRequestDto userDto, BindingResult bindingResult) {
    validationService.checkForValidationErrors(bindingResult);
    return userService.updateUserPassword(userDto);
  }

}
