package ee.rental.app.core.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.PropertyRepo;
import ee.rental.app.core.repository.BookingRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.BookingService;
import ee.rental.app.core.service.exception.PropertyNotFoundException;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;

public class BookingServiceImpl implements BookingService{
	@Autowired
	private BookingRepo bookingRepo;
	@Autowired
	private UserAccountRepo userAccountRepo;
	@Autowired
	private PropertyRepo propertyRepo;
	public Booking createBooking(Booking booking) {
		Property property = propertyRepo.findProperty(booking.getApartment().getId());
		if(property == null)
			throw new PropertyNotFoundException();
		UserAccount account = userAccountRepo.findUserAccount(booking.getAccount().getId());
		if(account == null)
			throw new UserAccountNotFoundException();
		return bookingRepo.createBooking(booking);
	}
	public List<Booking> findAllBookings() {
		return bookingRepo.findAllBookings();
	}
	public Booking findBooking(Long id) {
		return bookingRepo.findBooking(id);
	}
	public List<Booking> findBookingsByAccount(Long accountId) {
		UserAccount account = userAccountRepo.findUserAccount(accountId);
		if(account == null)
			throw new UserAccountNotFoundException();
		return bookingRepo.findBookingsByAccount(accountId);
	}
}