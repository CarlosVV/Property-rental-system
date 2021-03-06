package ee.rental.app.core.repository.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.Review;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.wrapper.UnavailableDatesForPublic;
import ee.rental.app.core.repository.BookingRepo;
import ee.rental.app.core.repository.PropertyRepo;
@Repository
public class BookingRepoImpl implements BookingRepo{

	@Autowired
	private SessionFactory sessionFactory;
	@Autowired
	private PropertyRepo propertyRepo;
	public Booking createBooking(Booking booking) {
		Session session = sessionFactory.getCurrentSession();
		session.persist(booking);
		session.flush();
		return booking;
	}

	public List<Booking> findAllBookings() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT b FROM Booking b");
		return query.list();
	}

	public Booking findBooking(Long id) {
		Session session = sessionFactory.getCurrentSession();
		Booking booking = (Booking)session.get(Booking.class, id);
		session.flush();
		return  booking;
	}

	public List<Booking> findBookingsByAccount(String username) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT b FROM Booking b WHERE b.userAccount.username=:username ORDER BY checkIn DESC");
		query.setParameter("username", username);
		List<Booking> result = (List<Booking>) query.list();
		session.flush();
		return result;
	}

	public BookingStatus findBookingStatusById(Long statusId) {
		Session session = sessionFactory.getCurrentSession();
		BookingStatus result = (BookingStatus) session.get(BookingStatus.class, statusId);
		session.flush();
		return result;
		
	}

	public List<Booking> findBookingsByYearAndProperty(Integer year,Long propertyId) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT b FROM Booking b WHERE b.property.id=:propertyId "
				+ "AND to_char(b.checkIn,'YYYY') = :year "
				+ "AND b.bookingStatus.name = 'Payed and accepted'");
		query.setParameter("propertyId", propertyId);
		query.setParameter("year", year);
		List<Booking> result = (List<Booking>) query.list();
		session.flush();
		return result;
	}

	public List<Booking> findBookingsByProperty(Long propertyId) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT b FROM Booking b WHERE b.property.id=:propertyId ORDER BY b.id DESC");
		query.setParameter("propertyId", propertyId);
		List<Booking> result = (List<Booking>) query.list();
		session.flush();
		return result;
	}

	public List<BookingStatus> findBookingStatuses() {
		Session session =  sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT bs FROM BookingStatus bs");
		List<BookingStatus> result = (List<BookingStatus>) query.list();
		session.flush();
		return result;
	}

	public void updateBookingStatus(Booking booking, BookingStatus bookingStatus) {
		Session session =  sessionFactory.getCurrentSession();
		booking.setBookingStatus(bookingStatus);
		session.update(booking);
		session.flush();
	}

	public List<Booking> findBookingsByAccountAndProperty(String username,
			Long propertyId) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT b FROM Booking b WHERE b.userAccount.username=:username AND b.property.id=:propertyId");
		query.setParameter("username", username);
		query.setParameter("propertyId", propertyId);
		List<Booking> result = (List<Booking>) query.list();
		session.flush();
		return result;
	}

	public List<Booking> findAllPropertiesBookings(String username) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT b FROM Booking b WHERE b.property.userAccount.username=:username "
				+ "ORDER BY id DESC");
		query.setParameter("username", username);
		List<Booking> result = (List<Booking>) query.list();
		session.flush();
		return result;
	}

	public List<Review> findReviewsByPropertyAndYear(Integer year, Long id) {
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT r FROM Review r WHERE r.property.id=:propertyId "
				+ "AND to_char(r.addingDate,'YYYY') = :year ");
		query.setParameter("propertyId", id);
		query.setParameter("year", year);
		List<Review> result = (List<Review>) query.list();
		session.flush();
		return result;
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
		Property property = propertyRepo.findProperty(id);
		for(Date date : dates){
			UnavailableDate unavailableDate = new UnavailableDate();
			unavailableDate.setProperty(property);
			unavailableDate.setWhen(date);
			session.save(unavailableDate);
		}
		session.flush();
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
}
