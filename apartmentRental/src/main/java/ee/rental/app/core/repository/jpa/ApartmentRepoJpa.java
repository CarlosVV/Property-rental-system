package ee.rental.app.core.repository.jpa;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import ee.rental.app.core.model.Apartment;
import ee.rental.app.core.model.wrapper.ApartmentQueryWrapper;
import ee.rental.app.core.repository.ApartmentRepo;

@Repository
public class ApartmentRepoJpa implements ApartmentRepo{
	@PersistenceContext
	private EntityManager em;
	public Apartment createApartment(Apartment apartment) {
		em.persist(apartment);
		return apartment;
	}

	public List<Apartment> findAllApartments() {
		Query query = em.createQuery("SELECT a FROM Apartment a");
		return query.getResultList();
	}

	public Apartment findApartment(Long id) {
		return em.find(Apartment.class, id);
	}

	public List<Apartment> findApartmentsByAccount(Long accountId) {
		Query query = em.createQuery("SELECT a FROM Apartment a where a.owner.id=?1");
		query.setParameter(1, accountId);
		return query.getResultList();
	}

	public Apartment updateApartment(Apartment data) {
		Apartment apartment = em.find(Apartment.class, data.getId());
		apartment.setTitle(data.getTitle());
		//need to add more
		return apartment;
	}

	public List<Apartment> queryApartmentsByCountry(ApartmentQueryWrapper query) {
		Query queryToDb = em.createQuery("SELECT a FROM Apartment a WHERE a.country=?1");
		queryToDb.setParameter(1, query.getCountry());
		return queryToDb.getResultList();
	}
	public List<Apartment> queryApartmentsByCity(ApartmentQueryWrapper query) {
		Query queryToDb = em.createQuery("SELECT a FROM Apartment a WHERE a.city=?1 AND a.country=?2");
		queryToDb.setParameter(1, query.getCity());
		queryToDb.setParameter(2, query.getCountry());
		return queryToDb.getResultList();
	}

}
