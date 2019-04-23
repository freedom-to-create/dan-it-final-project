package com.danit.finalproject.application.controller;

import com.danit.finalproject.application.dto.request.NotificationRequest;
import com.danit.finalproject.application.dto.response.NotificationResponse;
import com.danit.finalproject.application.dto.view.View;
import com.danit.finalproject.application.facade.NotificationFacade;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

  private NotificationFacade notificationFacade;

  @Autowired
  public NotificationController(NotificationFacade notificationFacade) {
    this.notificationFacade = notificationFacade;
  }

  @GetMapping
  @JsonView(View.class)
  public ResponseEntity<List<NotificationResponse>> findAllNotificationsByPlace(@RequestParam("placeId") Long id) {
    return new ResponseEntity<>(notificationFacade.findAllByPlace(id), HttpStatus.OK);
  }

  @PostMapping("/places")
  @JsonView(View.class)
  public ResponseEntity<NotificationResponse> createNewNotification(@RequestBody NotificationRequest notificationDto) {
    return new ResponseEntity<>(notificationFacade.create(notificationDto), HttpStatus.OK);
  }

  @PutMapping("/{id}")
  @JsonView(View.class)
  public ResponseEntity<NotificationResponse> updateNotification(
      @RequestBody NotificationRequest notificationDto,
      @PathVariable("id") Long id) {
    return new ResponseEntity<>(notificationFacade.update(id, notificationDto), HttpStatus.OK);
  }

  @DeleteMapping("{id}")
  @JsonView(View.class)
  public ResponseEntity<NotificationResponse> deleteNotification(@PathVariable("id") Long id) {
    return new ResponseEntity<>(notificationFacade.delete(id), HttpStatus.OK);
  }
}
