package ee.rental.app.core.service.impl;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Embeddable;
import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.ImagePath;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyFacility;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.Review;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.model.wrapper.PropertyWrapper;
import ee.rental.app.core.model.wrapper.ReviewWrapper;
import ee.rental.app.core.model.wrapper.UnavailableDatesForPublic;
import ee.rental.app.core.repository.BookingRepo;
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
	@Autowired
	private BookingRepo bookingRepo;

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
	public List<UnavailableDatesForPublic> findUnavailableDates(Long id) throws ParseException {
		List<UnavailableDate> unDates = propertyRepo.findUnavailabeDates(id);
		List<UnavailableDatesForPublic> bookedDates = propertyRepo.findBookedDates(id);
		List<UnavailableDatesForPublic> result = new ArrayList<UnavailableDatesForPublic>(bookedDates);
		for(UnavailableDate u : unDates){
			result.add(new UnavailableDatesForPublic(u.getWhen(), u.getWhen()));
		}
		//System.out.println("OK WE GOT RESULT: "+bookedDates);
		return result;
	}

	public List<PropertyFacility> findPropertyFacilities() {
		List<PropertyFacility> result = propertyRepo.findPropertyFacilities();
		return result;
	}

	public void updateProperty(Property property) {
		propertyRepo.updateProperty(property);
	}

	public List<UnavailableDate> findOnlyUnavailableDates(Long id) throws ParseException {
		return propertyRepo.findUnavailabeDates(id);
	}

	public List<UnavailableDatesForPublic> findOnlyBookedDates(Long id) throws ParseException {
		return propertyRepo.findBookedDates(id);
	}

	public void updatePropertyUnavailableDates(List<Date> dates, Long id) {
		propertyRepo.deleteUnavailableDates(id);
		propertyRepo.addUnavailableDates(dates,id);
	}

	public List<Review> findReviewsByPropertyId(Long id) {
		List<Review> result = propertyRepo.findReviewsByPropertyId(id);
		return result;
	}
	public Review findReviewById(Long id){
		return propertyRepo.findReviewById(id);
	}

	public Review addReview(ReviewWrapper review) {
		Review r = new Review();
		r.setAuthor(userAccountRepo.findUserAccountByUsername(review.getUsername()));
		if(review.getParentReviewId() != null)
			r.setParentReview(propertyRepo.findReviewById(review.getParentReviewId()));
		r.setProperty(propertyRepo.findProperty(review.getPropertyId()));
		r.setReview(review.getReview());
		r.setStars(review.getStars());
		return propertyRepo.addReview(r);
	}

	

}
