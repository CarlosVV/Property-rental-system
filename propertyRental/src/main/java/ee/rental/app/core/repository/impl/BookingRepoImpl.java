package ee.rental.app.core.repository.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;
import ee.rental.app.core.repository.BookingRepo;
@Repository
@Transactional
public class BookingRepoImpl implements BookingRepo{

	@Autowired
	private SessionFactory sessionFactory;
	public Booking createBooking(Booking booking) {
		sessionFactory.getCurrentSession().persist(booking);
		return booking;
	}

	public List<Booking> findAllBookings() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT b FROM Booking b");
		return query.list();
	}

	public Booking findBooking(Long id) {
		return (Booking) sessionFactory.getCurrentSession().get(Booking.class, id);
	}

	public List<Booking> findBookingsByAccount(Long accountId) {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT b FROM Booking b WHERE b.account.id=?1");
		query.setParameter(1, accountId);
		return query.list();
	}

}
