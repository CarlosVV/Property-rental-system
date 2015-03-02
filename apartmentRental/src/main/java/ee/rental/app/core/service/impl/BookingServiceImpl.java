package ee.rental.app.core.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import ee.rental.app.core.model.Apartment;
import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.ApartmentRepo;
import ee.rental.app.core.repository.BookingRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.BookingService;
import ee.rental.app.core.service.exception.ApartmentNotFoundException;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;

public class BookingServiceImpl implements BookingService{
	@Autowired
	private BookingRepo bookingRepo;
	@Autowired
	private UserAccountRepo userAccountRepo;
	@Autowired
	private ApartmentRepo apartmentRepo;
	public Booking createBooking(Booking booking) {
		Apartment apartment = apartmentRepo.findApartment(booking.getApartment().getId());
		if(apartment == null)
			throw new ApartmentNotFoundException();
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