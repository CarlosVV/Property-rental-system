package ee.rental.app.core.repository;

import java.util.List;

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;

public interface BookingRepo {
	public Booking createBooking(Booking booking);
	public List<Booking> findAllBookings();
	public Booking findBooking(Long id);
	public List<Booking> findBookingsByAccount(Long accountId);

}
