package com.danit.finalproject.application.dto.response.place;

import lombok.Data;

@Data
public class PlaceCategoryResponse {

  private Long id;
  private String name;
  private boolean multisync;

}