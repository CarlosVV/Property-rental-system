package ee.rental.app.core.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.repository.PropertyRepo;
import ee.rental.app.core.repository.BookingRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.BookingService;
import ee.rental.app.core.service.exception.PropertyNotFoundException;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;

@Service
@Transactional
public class BookingServiceImpl implements BookingService{
	@Autowired
	private BookingRepo bookingRepo;
	@Autowired
	private UserAccountRepo userAccountRepo;
	@Autowired
	private PropertyRepo propertyRepo;
	public Booking createBooking(Booking booking) {
		Property property = propertyRepo.findProperty(booking.getProperty().getId());
		if(property == null)
			throw new PropertyNotFoundException();
		booking.setProperty(property);
		UserAccount account = userAccountRepo.findUserAccountByUsername(booking.getUserAccount().getUsername());
		if(account == null)
			throw new UserAccountNotFoundException();
		booking.setUserAccount(account);
		booking.setBookingStatus(bookingRepo.findBookingStatusById(1L));
		LocalDateTime checkIn = LocalDateTime.ofInstant(booking.getCheckIn().toInstant(), ZoneId.systemDefault());
		LocalDateTime checkOut = LocalDateTime.ofInstant(booking.getCheckOut().toInstant(), ZoneId.systemDefault());
		int duration = (int) ChronoUnit.DAYS.between(checkIn, checkOut);
		booking.setPrice(property.getPricePerNight().multiply(new BigDecimal(duration)));
		return bookingRepo.createBooking(booking);
	}
	public List<Booking> findAllBookings() {
		return bookingRepo.findAllBookings();
	}
	public Booking findBooking(Long id) {
		return bookingRepo.findBooking(id);
	}
	public List<Booking> findBookingsByAccount(String username) {
		return bookingRepo.findBookingsByAccount(username);
	}
	public BookingStatus findBookingStatusById(long statusId){
		return bookingRepo.findBookingStatusById(statusId);
	}
}