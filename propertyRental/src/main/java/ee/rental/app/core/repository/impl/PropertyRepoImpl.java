package ee.rental.app.core.repository.impl;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Conjunction;
import org.hibernate.criterion.Restrictions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
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
import ee.rental.app.core.model.wrapper.UnavailableDatesForPublic;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.repository.PropertyRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.rest.controller.PropertyController;

@Repository
public class PropertyRepoImpl implements PropertyRepo{
	private static final Logger logger = LoggerFactory.getLogger(PropertyRepoImpl.class);
	@Autowired
	private SessionFactory sessionFactory;
	@Autowired
	private UserAccountRepo userAccountRepo;

	public List<Property> findAllProperties() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT p FROM Property p");
		return query.list();
	}

	public Property findProperty(Long id) {
		Session session =  sessionFactory.getCurrentSession();
		Property property = (Property) session.get(Property.class, id);
		session.flush();
		return property;
	}

	public List<Property> findPropertiesByOwner(String userAccount) {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT p FROM Property p where p.userAccount.username=:userAccount");
		query.setParameter("userAccount", userAccount);
		return query.list();
	}

	public void updateProperty(Property property) {
		Session session =  sessionFactory.getCurrentSession();
		//session.update(property);
		session.merge(property);
		List<ImagePath> tempImgs = new ArrayList<ImagePath>(property.getImagePaths());
		session.flush();
		Query query = session.createQuery("delete ImagePath WHERE property_id = :id");
		query.setLong("id", property.getId());
		query.executeUpdate();
		session.flush();
		for(ImagePath img : tempImgs){
			img.setProperty(property);
			session.save(img);
		}
		session.flush();
	}

	public List<Property> queryPropertiesByCountry(PropertyQueryWrapper query) {
		Query queryToDb = sessionFactory.getCurrentSession().createQuery("SELECT p FROM Property p WHERE p.country=?");
		queryToDb.setParameter(0, query.getCountry());
		return (List<Property>)queryToDb.list();
	}
	public List<Property> queryPropertiesByCity(PropertyQueryWrapper query) {
		//some streets have Harju maakond and some Harju country
		Query queryToDb = sessionFactory.getCurrentSession().createQuery("SELECT p FROM Property p WHERE (p.city=? AND p.country=? AND p.administrativeArea=?) OR (p.city=? AND p.country=?)");
		queryToDb.setParameter(0, query.getCity());
		queryToDb.setParameter(1, query.getCountry());
		queryToDb.setParameter(2, query.getAdministrativeArea());
		queryToDb.setParameter(3, query.getCity());
		queryToDb.setParameter(4, query.getCountry());
		return queryToDb.list();
	}

	public List<PropertyType> findAllPropertyTypes() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT p FROM PropertyType p");
		return (List<PropertyType>)query.list();
	}
	
	public Property addProperty(Property property) {
		/*Property p = new Property();
		p.setAddress(property.getAddress());
		p.setAdministrativeArea(property.getAdministrativeArea());
		p.setBathroomCount(Integer.parseInt(property.getBathroomCount()));
		p.setBedroomCount(Integer.parseInt(property.getBedroomCount()));
		p.setCity(property.getCity());
		p.setCountry(property.getCountry());
		p.setDescription(property.getDescription());
		p.setLatitude(Double.parseDouble(property.getLatitude()));
		p.setLongitude(Double.parseDouble(property.getLongitude()));
		p.setMinimumNights(Integer.parseInt(property.getMinimumNights()));
		p.setPostalCode(property.getPostalCode());
		p.setPricePerNight(new BigDecimal(property.getPricePerNight()));
		p.setPropertyType((PropertyType)sessionFactory.getCurrentSession().get(PropertyType.class, Long.parseLong(property.getPropertyType())));
		//p.setPropertyType(new PropertyType(1L, "Apartment", "Apartment desc"));
		p.setRules(property.getRules());
		p.setSize(Integer.parseInt(property.getSize()));
		p.setTitle(property.getTitle());*/
		Session session = sessionFactory.getCurrentSession();
		//property.setPropertyType((PropertyType)session.load(PropertyType.class, property.getPropertyType().getId()));
		UserAccount userAccount = userAccountRepo.findUserAccountByUsername(property.getUserAccount().getUsername());
		property.setUserAccount(userAccount);
		Long id = (Long) session.save(property);
		session.flush();
		property.setId(id);
		for(ImagePath img : property.getImagePaths()){
			img.setProperty(property);
			session.save(img);
		}
		session.flush();
		return property;
	}

	public List<UnavailableDatesForPublic> findBookedDates(Long id) throws ParseException {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date today = dateFormat.parse(dateFormat.format(new Date()));
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT new ee.rental.app.core.model.wrapper.UnavailableDatesForPublic(b.checkIn,b.checkOut) FROM Booking b"
				+ " WHERE b.property.id=? AND (b.bookingStatus.id=1 OR b.bookingStatus.id=2) AND b.checkOut >= ?");
		query.setParameter(0, id);
		query.setParameter(1, today);
		List<UnavailableDatesForPublic> result = (List<UnavailableDatesForPublic>) query.list();
		session.flush();
		return result;
	}
	public List<UnavailableDate> findUnavailabeDates(Long id) throws ParseException{
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		Date today = dateFormat.parse(dateFormat.format(new Date()));
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT u FROM UnavailableDate u WHERE u.property.id=? AND u.when >= ?");
		query.setParameter(0, id);
		query.setParameter(1, today);
		List<UnavailableDate> result = (List<UnavailableDate>) query.list();
		return result;
	}

	public List<PropertyFacility> findPropertyFacilities() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT pf FROM PropertyFacility pf");
		return query.list();
	}

	public void deleteUnavailableDates(Long id) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("DELETE FROM UnavailableDate ud WHERE ud.property.id=:id");
		query.setParameter("id", id);
		query.executeUpdate();
		session.flush();
	}

	public void addUnavailableDates(List<Date> dates, Long id) {
		Session session = sessionFactory.getCurrentSession();
		Property property = findProperty(id);
		for(Date date : dates){
			UnavailableDate unavailableDate = new UnavailableDate();
			unavailableDate.setProperty(property);
			unavailableDate.setWhen(date);
			session.save(unavailableDate);
		}
		session.flush();
	}

	public List<Review> findReviewsByPropertyId(Long id) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT r FROM Review r"
				+ " WHERE r.property.id=?");
		query.setParameter(0, id);
		List<Review> result = (List<Review>) query.list();
		session.flush();
		return result;
		
	}

	public Review findReviewById(Long id) {
		Session session = sessionFactory.getCurrentSession();
		Review result = (Review) session.get(Review.class, id);
		session.flush();
		return result;
	}

	public Review addReview(Review review) {
		Session session = sessionFactory.getCurrentSession();
		session.save(review);
		session.flush();
		return review;
	}

	public void deleteReview(Review review) {
		Session session = sessionFactory.getCurrentSession();
		Query queryChildReview = session.createQuery("SELECT r FROM Review r WHERE r.parentReview.id=:parentId");
		queryChildReview.setParameter("parentId", review.getId());
		Review childReview = (Review) queryChildReview.uniqueResult();
		if(childReview != null){
			Query query = session.createQuery("DELETE FROM Review r WHERE r.id IN (:id,:childId)");
			query.setParameter("id", review.getId());
			query.setParameter("parentId", childReview.getId());
			query.executeUpdate();
			session.flush();
		}else{
			Query query = session.createQuery("DELETE FROM Review r WHERE r.id = :id");
			query.setParameter("id", review.getId());
			query.executeUpdate();
			session.flush();
		}
	}



}
