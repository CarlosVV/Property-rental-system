package ee.rental.app.core.repository.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
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
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.model.wrapper.PropertyWrapper;
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
		session.update(property);
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

	public List<UnavailableDate> findBookedDates(Long id) {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT new UnavailableDate(b.checkIn,b.checkOut) FROM Booking b"
				+ " WHERE b.property.id=?");
		query.setParameter(0, id);
		return query.list();
	}
	public List<UnavailableDate> findUnavailabilityDates(Long id){
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT u FROM UnavailableDate u WHERE u.property.id=?");
		query.setParameter(0, id);
		return query.list();
	}

	public List<PropertyFacility> findPropertyFacilities() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT pf FROM PropertyFacility pf");
		return query.list();
	}

	/*public void addImagePaths(List<ImagePath> imagePaths) {
		Session session = sessionFactory.getCurrentSession();
	    session.save(imagePaths.get(0));
        session.flush();
        session.clear();
	}*/



}
