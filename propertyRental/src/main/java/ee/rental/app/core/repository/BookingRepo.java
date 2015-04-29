package ee.rental.app.core.repository;

import java.text.ParseException;
import java.util.Date;
import java.util.List;

import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.Review;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.wrapper.UnavailableDatesForPublic;

public interface BookingRepo {
	public Booking createBooking(Booking booking);
	public List<Booking> findAllBookings();
	public Booking findBooking(Long id);
	public List<Booking> findBookingsByAccount(String username);
	public BookingStatus findBookingStatusById(Long statusId);
	public List<Booking> findBookingsByProperty(Long propertyId);
	public List<Booking> findBookingsByYearAndProperty(Integer year,Long propertyId);
	public List<BookingStatus> findBookingStatuses();
	public void updateBookingStatus(Booking booking, BookingStatus bookingStatus);
	public List<Booking> findBookingsByAccountAndProperty(String username,
			Long propertyId);
	public List<Booking> findAllPropertiesBookings(String username);
	public List<Review> findReviewsByPropertyAndYear(Integer year, Long id);
	public List<UnavailableDate> findUnavailabeDates(Long id) throws ParseException;
	public void deleteUnavailableDates(Long id);
	public void addUnavailableDates(List<Date> dates, Long id);
	public List<UnavailableDatesForPublic> findBookedDates(Long id) throws ParseException;
}
