package ee.rental.app.core.repository;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.ImagePath;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyFacility;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.Review;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.model.wrapper.PropertyWrapper;
import ee.rental.app.core.model.wrapper.UnavailableDatesForPublic;

public interface PropertyRepo {
	public List<Property> findAllProperties();
	public Property findProperty(Long id);
	public List<Property> findPropertiesByOwner(String userAccount);
	public void updateProperty(Property data);
	public List<Property> queryPropertiesByCity(PropertyQueryWrapper query);
	public List<Property> queryPropertiesByCountry(PropertyQueryWrapper query);
	public List<PropertyType> findAllPropertyTypes();
	public Property addProperty(Property data);
	//public void addImagePaths(List<ImagePath> imagePaths);
	public List<UnavailableDate> findUnavailabeDates(Long id) throws ParseException;
	public List<UnavailableDatesForPublic> findBookedDates(Long id) throws ParseException;
	public List<PropertyFacility> findPropertyFacilities();
	public void deleteUnavailableDates(Long id);
	public void addUnavailableDates(List<Date> dates, Long id);
	public List<Review> findReviewsByPropertyId(Long id);
	public Review findReviewById(Long id);
	public Review addReview(Review review);
}
