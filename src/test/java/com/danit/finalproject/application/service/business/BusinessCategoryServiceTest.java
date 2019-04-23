package com.danit.finalproject.application.service.business;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.danit.finalproject.application.entity.business.BusinessCategory;
import com.danit.finalproject.application.entity.place.PlaceCategory;
import com.danit.finalproject.application.repository.business.BusinessCategoryRepository;
import com.danit.finalproject.application.service.AmazonS3Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
@SpringBootTest
public class BusinessCategoryServiceTest {

  @Autowired
  private BusinessCategoryService businessCategoryService;

  @MockBean
  private BusinessCategoryRepository businessCategoryRepository;

  @MockBean
  private AmazonS3Service amazonS3Service;

  @Test
  public void verifyFindByIdCalledOnce() {
    Long expectedId = 1L;
    when(businessCategoryRepository.findById(expectedId))
        .thenReturn(Optional.of(new BusinessCategory()));

    BusinessCategory businessCategory = businessCategoryService.getById(expectedId);

    verify(businessCategoryRepository, times(1)).findById(expectedId);
    assertNotNull(businessCategory);
  }

  @Test
  public void verifyFindAllCalledOnce() {
    when(businessCategoryRepository.findAll()).thenReturn(new ArrayList<>());

    List<BusinessCategory> businessCategories = businessCategoryService.getAll();

    verify(businessCategoryRepository, times(1)).findAll();
    assertNotNull(businessCategories);
  }

  @Test
  public void verifySaveCalledOnce() {
    String expectedName = "testName";
    BusinessCategory businessCategory = new BusinessCategory();
    businessCategory.setName(expectedName);
    when(businessCategoryRepository.save(businessCategory)).thenReturn(businessCategory);
    BusinessCategory createdBusinessCategory = businessCategoryService.create(businessCategory);

    verify(businessCategoryRepository, times(1)).save(businessCategory);
    assertEquals(expectedName, createdBusinessCategory.getName());
  }

  @Test
  public void verifySaveCalledOnceAndS3ServiceDeleteCalledTwice() {
    Long expectedId = 2L;
    String expectedName = "testName";
    String expectedImageKey = "imageKey";
    String expectedIconKey = "iconKey";
    String currentImageKey = "currentImageKey";
    String currentIconKey = "currentIconKey";
    BusinessCategory updateBusinessCategory = new BusinessCategory();
    updateBusinessCategory.setId(expectedId);
    updateBusinessCategory.setName(expectedName);
    updateBusinessCategory.setImageKey(expectedImageKey);
    updateBusinessCategory.setIconKey(expectedIconKey);
    BusinessCategory currentBusinessCategory = new BusinessCategory();
    currentBusinessCategory.setImageKey(currentImageKey);
    currentBusinessCategory.setIconKey(currentIconKey);

    when(businessCategoryRepository.findById(expectedId))
        .thenReturn(Optional.of(currentBusinessCategory));
    when(businessCategoryRepository.saveAndFlush(updateBusinessCategory))
        .thenReturn(updateBusinessCategory);
    BusinessCategory updatedBusinessCategory = businessCategoryService
        .update(expectedId, updateBusinessCategory);

    verify(businessCategoryRepository, times(1)).saveAndFlush(updateBusinessCategory);
    verify(amazonS3Service, times(1)).deleteObject(currentImageKey);
    verify(amazonS3Service, times(1)).deleteObject(currentIconKey);
    assertEquals(expectedId, updatedBusinessCategory.getId());
    assertEquals(expectedName, updatedBusinessCategory.getName());
    assertEquals(expectedImageKey, updatedBusinessCategory.getImageKey());
    assertEquals(expectedIconKey, updatedBusinessCategory.getIconKey());
  }

  @Test
  public void verifyDeleteCalledOnceAndS3ServiceDeleteCalledTwice() {
    Long expectedId = 1L;
    String expectedName = "business-category-1";
    String expectedImageKey = "imageKey";
    String expectedIconKey = "iconKey";

    BusinessCategory businessCategory = new BusinessCategory();
    businessCategory.setName(expectedName);
    businessCategory.setImageKey(expectedImageKey);
    businessCategory.setIconKey(expectedIconKey);
    businessCategory.setId(expectedId);
    businessCategory.setBusinesses(new ArrayList<>());
    businessCategory.setPlaceCategories(new ArrayList<>());

    List<BusinessCategory> businessCategories = new ArrayList<>();
    BusinessCategory childBusinessCategory = new BusinessCategory();
    childBusinessCategory.setParentCategory(businessCategory);
    businessCategories.add(childBusinessCategory);

    when(businessCategoryRepository.findById(expectedId)).thenReturn(Optional.of(businessCategory));
    when(businessCategoryRepository.findAll()).thenReturn(businessCategories);

    BusinessCategory deletedBusinessCategory = businessCategoryService.delete(expectedId);

    verify(amazonS3Service, times(1)).deleteObject(expectedImageKey);
    verify(amazonS3Service, times(1)).deleteObject(expectedIconKey);
    verify(businessCategoryRepository, times(1)).findAll();
    verify(businessCategoryRepository, times(1)).delete(businessCategory);
    assertEquals(businessCategory, deletedBusinessCategory);
  }

  @Test
  public void verifyFindByParentCategoryIsNullCalledOnce() {
    BusinessCategory parentBusinessCategory = new BusinessCategory("business-category-1",
        null,null, null,"imageKey", null, null);
    when(businessCategoryRepository.findByParentCategoryIsNull())
        .thenReturn(new ArrayList<BusinessCategory>() {{
          add(parentBusinessCategory);
          add(new BusinessCategory("business-category-3", null,
              null, null, null, null, null));
        }});

    List<BusinessCategory> parentBusinessCategories = businessCategoryService.findByParentCategoryIsNull();

    verify(businessCategoryRepository, times(1)).findByParentCategoryIsNull();
    assertNotNull(parentBusinessCategories);
    assertEquals(2, parentBusinessCategories.size());
    assertEquals(parentBusinessCategory, parentBusinessCategories.get(0));
  }
}