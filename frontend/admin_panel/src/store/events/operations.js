import api from '../../helpers/FetchData'
import * as ACTIONS from './actions'
import {getBusinessesByTitle} from "../businesses/operations";
import {getAllEventCategories} from "../eventCategory/operations";
import {getAllPlaces} from "../places/operations";

export const fetchEventFormData = (searchParam, page, size) => dispatch => {
  dispatch(ACTIONS.isEventFormDataLoading(true))
  Promise.all([
    dispatch(getAllEventsByParams(searchParam, page, size)),
    dispatch(getAllEventCategories()),
    dispatch(getBusinessesByTitle()),
    dispatch(getAllPlaces())
  ]).then(() => dispatch(ACTIONS.isEventFormDataLoading(false)))
}

export const getAllEventsByParams = (param = '', page = 0, size = 5) => dispatch => {
  dispatch(ACTIONS.isEventDataLoading(true))
  dispatch(ACTIONS.setSearchParam(param))
  return api.get(`/api/events?searchParam=${param}&page=${page}&size=${size}`).then(res => {
    dispatch(ACTIONS.getAllEvents(res))
    dispatch(ACTIONS.isEventDataLoading(false))
  })
}

export const deleteEvent = (eventId, searchParam, page, size) => dispatch => {
  dispatch(ACTIONS.isEventDataLoading(true))
  api.deleteApi(`/api/events/${eventId}`).then(res => {
    dispatch(getAllEventsByParams(searchParam, page, size))
  })
}

export const saveEvent = (event, images) => dispatch => {
  dispatch(ACTIONS.isEventFormDataLoading(true))
  if (event.id) {
    const imagesToUpload = images.filter(image => !image.id)
    const existingImages = images.filter(image => image.id)
    return uploadImagesToS3(imagesToUpload)
      .then(uploadedImages => createEventPhotos(uploadedImages, event.id)
          .then(createdPhotos => updateEvent(existingImages, event, createdPhotos)
            .then()
          )
      )
  } else {
    return createEvent(event)
      .then(createdBusiness => uploadImagesToS3(images)
        .then(uploadedImages => createEventPhotos(uploadedImages, createdBusiness.id)
          .then(createdPhotos => updateEvent(null, createdBusiness, createdPhotos)
            .then()
          )
        )
      )
  }
}

const uploadImagesToS3 = (imagesToUpload) => {
  return Promise.all(
    imagesToUpload.map(image => {
      const formData = new FormData()
      formData.append("imageFile", image)
      return api.post('/api/s3/upload/image', formData)
    }))
}

const createEventPhotos = (s3UploadResponse, eventId) => {
  const array = []
  s3UploadResponse.forEach(file => array.push({imageKey: file.fileKey}))
  return api.post(`/api/events/${eventId}/photos`, array)
}

const updateEvent = (existingImages, event, createdPhotos) => {
  event.photos = existingImages ? existingImages.concat(createdPhotos.photos) : createdPhotos.photos
  return api.put(`/api/events/${event.id}`, event)
}

const createEvent = (event) => {
  return api.post(`/api/events`, event)
}
