package ee.rental.app.core.service;

import java.util.List;

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyFacility;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.model.wrapper.PropertyWrapper;
import ee.rental.app.core.model.UnavailableDate;

public interface PropertyService {
	public Property findProperty(Long id);
	public List<Property> findPropertiesByOwner(Long ownerId);
	public List<Property> queryProperties(PropertyQueryWrapper query);
	public List<PropertyType> findAllPropertyTypes();
	public Property addProperty(Property property);
	public List<UnavailableDate> findUnavailableDates(Long id);
	public List<PropertyFacility> findPropertyFacilities();
	public void updateProperty(Property property);
}
