package com.danit.finalproject.application.controller;

import com.danit.finalproject.application.entity.business.Business;
import com.danit.finalproject.application.entity.place.Place;
import com.danit.finalproject.application.entity.place.PlacePhoto;
import com.danit.finalproject.application.service.business.BusinessService;
import com.danit.finalproject.application.service.place.PlaceCategoryService;
import com.danit.finalproject.application.service.place.PlacePhotoService;
import com.danit.finalproject.application.service.place.PlaceService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.MOCK)
@AutoConfigureMockMvc
@Transactional
public class PlacePhotoControllerTest {
  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private ObjectMapper objectMapper;

  @Autowired
  private PlaceService placeService;

  @Autowired
  private PlaceCategoryService placeCategoryService;

  @Autowired
  private PlacePhotoService placePhotoService;

  @Autowired
  private BusinessService businessService;

  @Test
  public void createNewPlacePhoto() throws Exception {
    Long expectedId = 3L;
    String expectedName = "photo-3";

    PlacePhoto placePhoto = new PlacePhoto();
    placePhoto.setId(expectedId);
    placePhoto.setPhoto(expectedName);

    String placeCategoryJson = objectMapper.writeValueAsString(placePhoto);

    MvcResult result = mockMvc.perform(
        post("/api/places/1/photos")
            .content(placeCategoryJson)
            .contentType(MediaType.APPLICATION_JSON))
        .andReturn();
    String responseBody = result.getResponse().getContentAsString();
    PlacePhoto createdPlacePhoto = objectMapper.readValue(responseBody, PlacePhoto.class);
    Long createdPlacePhotoId= createdPlacePhoto.getId();

    assertEquals(expectedName, createdPlacePhoto.getPhoto());
    assertNotNull(createdPlacePhoto.getCreatedDate());
    assertNotNull(createdPlacePhoto.getModifiedDate());
    assertNotNull(createdPlacePhotoId);
    assertEquals(createdPlacePhoto.getPlace().getId(), placeService.getPlaceById(1L).getId());
  }

  @Test
  public void deletePlace() throws Exception {
    mockMvc.perform(delete("/api/places/1/photos/1"));

    assertNull(placePhotoService.getPlacePhotoByIdAndPlace(1L, 1L));
  }
}
