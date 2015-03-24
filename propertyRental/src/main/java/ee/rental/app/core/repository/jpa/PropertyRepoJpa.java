package ee.rental.app.core.repository.jpa;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.repository.PropertyRepo;

@Repository
public class PropertyRepoJpa implements PropertyRepo{
	@PersistenceContext
	private EntityManager em;
	public Property createProperty(Property property) {
		em.persist(property);
		return property;
	}

	public List<Property> findAllProperties() {
		Query query = em.createQuery("SELECT p FROM Property p");
		return query.getResultList();
	}

	public Property findProperty(Long id) {
		return em.find(Property.class, id);
	}

	public List<Property> findPropertiesByAccount(Long accountId) {
		Query query = em.createQuery("SELECT p FROM Property p where p.owner.id=?1");
		query.setParameter(1, accountId);
		return query.getResultList();
	}

	public Property updateProperty(Property data) {
		Property property = em.find(Property.class, data.getId());
		property.setTitle(data.getTitle());
		//need to add more
		return property;
	}

	public List<Property> queryPropertiesByCountry(PropertyQueryWrapper query) {
		Query queryToDb = em.createQuery("SELECT p FROM Property p WHERE p.country=?1");
		queryToDb.setParameter(1, query.getCountry());
		return queryToDb.getResultList();
	}
	public List<Property> queryPropertiesByCity(PropertyQueryWrapper query) {
		Query queryToDb = em.createQuery("SELECT p FROM Property p WHERE p.city=?1 AND p.country=?2 AND p.administrativeArea=?3");
		queryToDb.setParameter(1, query.getLocality());
		queryToDb.setParameter(2, query.getCountry());
		queryToDb.setParameter(3, query.getAdministrativeAreaLevel1());
		return queryToDb.getResultList();
	}

	@Override
	public List<PropertyType> findAllPropertyTypes() {
		Query query = em.createQuery("SELECT p FROM PropertyType p");
		return query.getResultList();
	}
	

}
