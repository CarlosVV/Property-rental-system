package ee.rental.app.core.repository;

import java.util.Date;
import java.util.List;

import ee.rental.app.core.model.ImagePath;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyFacility;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.model.wrapper.PropertyWrapper;

public interface PropertyRepo {
	public List<Property> findAllProperties();
	public Property findProperty(Long id);
	public List<Property> findPropertiesByOwner(Long ownerId);
	public void updateProperty(Property data);
	public List<Property> queryPropertiesByCity(PropertyQueryWrapper query);
	public List<Property> queryPropertiesByCountry(PropertyQueryWrapper query);
	public List<PropertyType> findAllPropertyTypes();
	public Property addProperty(Property data);
	//public void addImagePaths(List<ImagePath> imagePaths);
	public List<UnavailableDate> findUnavailabilityDates(Long id);
	public List<UnavailableDate> findBookedDates(Long id);
	public List<PropertyFacility> findPropertyFacilities();
}
