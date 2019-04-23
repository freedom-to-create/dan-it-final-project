package com.danit.finalproject.application.entity.place;

import com.danit.finalproject.application.entity.BaseEntity;
import com.danit.finalproject.application.entity.LayoutItem;
import com.danit.finalproject.application.entity.business.BusinessCategory;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import java.util.List;

@Entity
@Table(name = "places_categories")
@Data
@NoArgsConstructor
public class PlaceCategory extends BaseEntity {

  @Column(name = "name")
  private String name;

  @Column(name = "multisync")
  private boolean multisync;

  @ManyToMany(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH})
  @JoinTable(name = "placecategories_businesscategories",
      joinColumns = {@JoinColumn(name = "place_category_id")},
      inverseJoinColumns = {@JoinColumn(name = "business_category_id")})
  @ToString.Exclude
  private List<BusinessCategory> businessCategories;
  
  @OneToMany(mappedBy = "placeCategory")
  @ToString.Exclude
  private List<Place> places;

  @Column(name = "description")
  private String description;

  @ElementCollection
  @CollectionTable(name = "place_category_layout_items", joinColumns = @JoinColumn(name = "place_category_id"))
  @Column(name = "layout_item_id")
  private List<LayoutItem> layoutItems;
}
