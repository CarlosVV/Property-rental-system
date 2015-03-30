package ee.rental.app.core.service.impl;

import java.util.List;

import javax.persistence.Embeddable;
import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.ImagePath;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyFacility;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.model.wrapper.PropertyWrapper;
import ee.rental.app.core.repository.PropertyRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.PropertyService;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;

@Service
@Transactional(readOnly=false)
public class PropertyServiceImpl implements PropertyService{
	@Autowired
	private PropertyRepo propertyRepo;
	@Autowired
	private UserAccountRepo userAccountRepo;

	public Property findProperty(Long id) {
		System.out.println("PROPERTY ID: "+id);
		Property resultProperty = propertyRepo.findProperty(id);
		System.out.println("WE GOT "+resultProperty);
		return resultProperty;
	}
	
	public List<Property> findPropertiesByOwner(String userAccount) {
		return propertyRepo.findPropertiesByOwner(userAccount);
	}
	
	public List<Property> queryProperties(PropertyQueryWrapper query) {
		if(!query.getCity().equals("")){
			return propertyRepo.queryPropertiesByCity(query);
		}else{
			return propertyRepo.queryPropertiesByCountry(query);
		}
	}
	public List<PropertyType> findAllPropertyTypes(){
		return propertyRepo.findAllPropertyTypes();
	}

	public Property addProperty(Property data) {
		/*UserAccount account = userAccountRepo.findUserAccount(property.getOwner().getId());
		if(account == null)
			throw new UserAccountNotFoundException();*/
		Property property = propertyRepo.addProperty(data);
		/*for(ImagePath img : property.getImagePaths()){
			System.out.println("Setting property");
			img.setProperty(property);
		}*/
		System.out.println("inserted");
		//propertyRepo.addImagePaths(property.getImagePaths());
		return property;
	}
	public List<UnavailableDate> findUnavailableDates(Long id) {
		List<UnavailableDate> bookedDates = propertyRepo.findUnavailabilityDates(id);
		List<UnavailableDate> unDates = propertyRepo.findBookedDates(id);
		bookedDates.addAll(unDates);
		//System.out.println("OK WE GOT RESULT: "+bookedDates);
		return bookedDates;
	}

	public List<PropertyFacility> findPropertyFacilities() {
		List<PropertyFacility> result = propertyRepo.findPropertyFacilities();
		return result;
	}

	public void updateProperty(Property property) {
		propertyRepo.updateProperty(property);
	}

}
