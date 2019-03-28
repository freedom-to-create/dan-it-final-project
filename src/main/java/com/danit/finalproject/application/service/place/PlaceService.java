package com.danit.finalproject.application.service.place;

import com.danit.finalproject.application.entity.place.Place;
import com.danit.finalproject.application.entity.place.PlacePhoto;
import com.danit.finalproject.application.repository.place.PlaceRepository;
import com.danit.finalproject.application.service.CrudService;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlaceService implements CrudService<Place> {
  private PlaceRepository placeRepository;

  @Autowired
  public PlaceService(PlaceRepository placeRepository) {
    this.placeRepository = placeRepository;
  }

  @Override
  public Place getById(Long id) {
    return placeRepository.findById(id).orElse(null);
  }

  @Override
  public List<Place> getAll() {
    return placeRepository.findAll();
  }

  @Override
  public Place create(Place place) {
    return placeRepository.save(place);
  }

  @Override
  public Place update(Long id, Place place) {
    place.setId(id);
    return placeRepository.saveAndFlush(place);
  }

  @Override
  public Place delete(Long id) {
    Place place = placeRepository.findById(id).orElse(null);
    placeRepository.deleteById(id);
    return place;
  }

  public Place addPhoto(PlacePhoto placePhoto, Long placeId) {
    Optional<Place> optionalPlace = placeRepository.findById(placeId);
    optionalPlace.ifPresent(place -> place.getPhotos().add(placePhoto));
    Place place = optionalPlace.orElse(null);
    placeRepository.save(place);
    return place;
  }
}
