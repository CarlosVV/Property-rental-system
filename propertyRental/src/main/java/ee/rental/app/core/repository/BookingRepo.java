package ee.rental.app.core.repository;

import java.util.List;

import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;

public interface BookingRepo {
	public Booking createBooking(Booking booking);
	public List<Booking> findAllBookings();
	public Booking findBooking(Long id);
	public List<Booking> findBookingsByAccount(String username);
	public BookingStatus findBookingStatusById(Long statusId);
	public List<Booking> findBookingsByProperty(Long propertyId);
	public List<Booking> findBookingsByYearAndProperty(Integer year,Long propertyId);
}
