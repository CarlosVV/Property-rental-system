package ee.rental.app.core.repository.impl;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.model.wrapper.PropertyWrapper;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.repository.PropertyRepo;
import ee.rental.app.rest.controller.PropertyController;

@Repository
@Transactional(readOnly=false)
public class PropertyRepoImpl implements PropertyRepo{
	private static final Logger logger = LoggerFactory.getLogger(PropertyRepoImpl.class);
	@Autowired
	private SessionFactory sessionFactory;

	public List<Property> findAllProperties() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT p FROM Property p");
		return query.list();
	}

	public Property findProperty(Long id) {
		return (Property) sessionFactory.getCurrentSession().get(Property.class, id);
	}

	public List<Property> findPropertiesByAccount(Long accountId) {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT p FROM Property p where p.owner.id=?1");
		query.setParameter(1, accountId);
		return query.list();
	}

	public Property updateProperty(Property data) {
		Property property = (Property) sessionFactory.getCurrentSession().get(Property.class, data.getId());
		property.setTitle(data.getTitle());
		//need to add more
		return property;
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
	
	public Property addProperty(PropertyWrapper property) {
		Property p = new Property();
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
		p.setTitle(property.getTitle());
		sessionFactory.getCurrentSession().save(p);
		return p;
	}

	public List<UnavailableDate> findBookedDates(Long id) {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT new UnavailableDate(b.bookingStart,b.bookingEnd) FROM Booking b"
				+ " WHERE b.property.id=?");
		query.setParameter(0, id);
		return query.list();
	}
	public List<UnavailableDate> findUnavailabilityDates(Long id){
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT u FROM UnavailableDate u WHERE u.property.id=?");
		query.setParameter(0, id);
		return query.list();
	}



}
