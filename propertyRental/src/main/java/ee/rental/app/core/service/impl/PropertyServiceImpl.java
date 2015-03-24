package ee.rental.app.core.service.impl;

import java.util.List;

import javax.persistence.Embeddable;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.repository.PropertyRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.PropertyService;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;

@Service
@Transactional
public class PropertyServiceImpl implements PropertyService{
	@Autowired
	private PropertyRepo propertyRepo;
	@Autowired
	private UserAccountRepo userAccountRepo;
	public Property createApartment(Property property) {
		UserAccount account = userAccountRepo.findUserAccount(property.getOwner().getId());
		if(account == null)
			throw new UserAccountNotFoundException();
		return propertyRepo.createProperty(property);
	}

	public List<Property> findAllApartments() {
		return propertyRepo.findAllProperties();
	}

	public Property findApartment(Long id) {
		return propertyRepo.findProperty(id);
	}
	
	public List<Property> findApartmentsByAccount(Long accountId) {
		return propertyRepo.findPropertiesByAccount(accountId);
	}
	
	public List<Property> queryApartments(PropertyQueryWrapper query) {
		if(!query.getLocality().equals("")){
			return propertyRepo.queryPropertiesByCity(query);
		}else{
			return propertyRepo.queryPropertiesByCountry(query);
		}
	}
	public List<PropertyType> findAllApartmentTypes(){
		return propertyRepo.findAllPropertyTypes();
	}

}
