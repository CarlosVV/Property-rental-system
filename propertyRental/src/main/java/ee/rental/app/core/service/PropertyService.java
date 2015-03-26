package ee.rental.app.core.service;

import java.util.List;

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.model.wrapper.PropertyWrapper;

public interface PropertyService {
	public List<Property> findAllApartments();
	public Property findApartment(Long id);
	public List<Property> findApartmentsByAccount(Long accountId);
	public List<Property> queryApartments(PropertyQueryWrapper query);
	public List<PropertyType> findAllApartmentTypes();
	public Property addProperty(PropertyWrapper data);
}
