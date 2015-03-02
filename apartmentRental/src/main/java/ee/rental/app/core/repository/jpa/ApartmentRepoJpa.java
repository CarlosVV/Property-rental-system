package ee.rental.app.core.repository.jpa;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import ee.rental.app.core.model.Apartment;
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

}
