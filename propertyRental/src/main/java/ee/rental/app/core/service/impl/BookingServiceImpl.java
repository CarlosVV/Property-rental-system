package ee.rental.app.core.service.impl;

import java.awt.print.Book;
import java.math.BigDecimal;
import java.text.DateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.aspectj.weaver.ast.Var;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.wrapper.BookedDaysWrapper;
import ee.rental.app.core.repository.PropertyRepo;
import ee.rental.app.core.repository.BookingRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.BookingService;
import ee.rental.app.core.service.exception.BookingNotFoundException;
import ee.rental.app.core.service.exception.BookingStatusNotFoundException;
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
	public List<BookedDaysWrapper> findBookedDaysPerMonthsInYearByProp(Integer year,Long propertyId) {
		List<Booking> bookings = bookingRepo.findBookingsByYearAndProperty(year, propertyId);
		List<LocalDate> totalDates = new ArrayList<LocalDate>();
		for(Booking b : bookings){
			LocalDate start = b.getCheckIn().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			LocalDate end = b.getCheckOut().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			while(!start.isAfter(end)){
				totalDates.add(start);
				start = start.plusDays(1);
			}
		}
		Map<Integer,Integer> daysInMonths = new HashMap<Integer,Integer>();
		for(LocalDate d : totalDates){
			int month = d.getMonth().getValue();
			if(daysInMonths.containsKey(month)){
				int temp = daysInMonths.get(month);
				daysInMonths.put(month, temp+1);
			}else{
				daysInMonths.put(month, 1);
			}
		}
		List<BookedDaysWrapper> finalResult = new ArrayList<BookedDaysWrapper>();
		for (Map.Entry<Integer, Integer> entry : daysInMonths.entrySet()) {
			//Double temp = new Double((entry.getValue().doubleValue() / 30) * 100);
			finalResult.add(new BookedDaysWrapper(entry.getKey(),entry.getValue()));
		}
		//for those months which dont have booked days
		for(Integer i=1;i<=12;i++){
			if(!daysInMonths.containsKey(i)){
				finalResult.add(new BookedDaysWrapper(i,0));
			}
		}
		Collections.sort(finalResult,new Comparator<BookedDaysWrapper>() {
			public int compare(BookedDaysWrapper b1, BookedDaysWrapper b2){
				return b1.getMonth().compareTo(b2.getMonth());
			}
		});
		return finalResult;
	}

	public List<Booking> findBookingsByProperty(Long propertyId) {
		return bookingRepo.findBookingsByProperty(propertyId);
	}
	public List<BookingStatus> findBookingStatuses() {
		return bookingRepo.findBookingStatuses();
	}
	public boolean updateBookingStatus(Long bookingId, Long statusId) {
		Booking booking = findBooking(bookingId);
		if(booking == null)
			throw new BookingNotFoundException();
		BookingStatus bookingStatus = findBookingStatusById(statusId);
		if(bookingStatus == null)
			throw new BookingStatusNotFoundException();
		bookingRepo.updateBookingStatus(booking,bookingStatus);
		return true;
		
	}
	public boolean canSendReviews(String username, Long propertyId) {
		List<Booking> bookings = bookingRepo.findBookingsByAccountAndProperty(username,propertyId);
		Property property = propertyRepo.findProperty(propertyId);
		if(bookings.size() > 0 || property.getUserAccount().getUsername().equals(username))
			return true;
		return false;
	}
	public List<Booking> findPropertiesBookingsByYear(String username) {
		return bookingRepo.findAllPropertiesBookings(username);
	}
}