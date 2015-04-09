package ee.rental.app.core.service;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.wrapper.statistics.BookedDaysWrapper;
import ee.rental.app.core.model.wrapper.statistics.BookingAvgLength;
import ee.rental.app.core.model.wrapper.statistics.BookingGuestCountWrapper;
import ee.rental.app.core.model.wrapper.statistics.BookingLengthCount;
import ee.rental.app.core.model.wrapper.statistics.ReviewStarsWrapper;

public interface BookingService {
	public Booking createBooking(Booking booking);
	public List<Booking> findAllBookings();
	public Booking findBooking(Long id);
	public List<Booking> findBookingsByAccount(String string);
	public List<BookedDaysWrapper> findBookedDaysPerMonthsInYearByProp(Integer year, Long propertyId);
	public List<Booking> findBookingsByProperty(Long propertyId);
	public List<BookingStatus> findBookingStatuses();
	public boolean updateBookingStatus(Long bookingId, Long statusId);
	public boolean canSendReviews(String username, Long propertyId);
	public List<Booking> findPropertiesBookingsByYear(String username);
	public List<BookingGuestCountWrapper> findBookingGuestCountPerMonthsInYearByProp(
			Integer year, Long id);
	public List<ReviewStarsWrapper> findReviewsAvgStars(Integer year,
			Long id);
	public List<BookingLengthCount> findBookingAvgLength(Integer year, Long id);
}
