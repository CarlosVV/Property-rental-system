package ee.rental.app.core.repository.jpa;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;
import ee.rental.app.core.repository.BookingRepo;
@Repository
public class BookingRepoJPpa implements BookingRepo{
	@PersistenceContext
	private EntityManager em;
	public Booking createBooking(Booking booking) {
		em.persist(booking);
		return booking;
	}

	public List<Booking> findAllBookings() {
		Query query = em.createQuery("SELECT b FROM Booking b");
		return query.getResultList();
	}

	public Booking findBooking(Long id) {
		return em.find(Booking.class, id);
	}

	public List<Booking> findBookingsByAccount(Long accountId) {
		Query query = em.createQuery("SELECT b FROM Booking b WHERE b.account.id=?1");
		query.setParameter(1, accountId);
		return query.getResultList();
	}

}
