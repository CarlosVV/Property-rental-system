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
import ee.rental.app.core.model.Review;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.wrapper.statistics.BookedDaysWrapper;
import ee.rental.app.core.model.wrapper.statistics.BookingAvgLength;
import ee.rental.app.core.model.wrapper.statistics.BookingCount;
import ee.rental.app.core.model.wrapper.statistics.BookingGuestCountWrapper;
import ee.rental.app.core.model.wrapper.statistics.BookingLengthCount;
import ee.rental.app.core.model.wrapper.statistics.ReviewStarsWrapper;
import ee.rental.app.core.model.wrapper.util.MonthComparator;
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
		Collections.sort(finalResult,new MonthComparator());
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
	public List<Booking> findPropertiesBookings(String username) {
		return bookingRepo.findAllPropertiesBookings(username);
	}
	public List<BookingGuestCountWrapper> findBookingGuestCountPerMonthsInYearByProp(
			Integer year, Long id) {
		List<Booking> bookings = bookingRepo.findBookingsByYearAndProperty(year, id);
		Map<Integer, Integer> monthBookingCount = new HashMap<Integer, Integer>();
		Map<Integer, Integer> monthAmountOfGuests = new HashMap<Integer, Integer>();
		for(Booking b : bookings){
			LocalDate bookingStart = b.getCheckIn().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			Integer month = bookingStart.getMonthValue();
			if(monthAmountOfGuests.containsKey(month)){
				Integer tempGuestCount = monthAmountOfGuests.get(month);
				monthAmountOfGuests.put(month, tempGuestCount + b.getGuestNumber());
				Integer tempBookingCount = monthBookingCount.get(month);
				monthBookingCount.put(month, tempBookingCount+1);
			}else{
				monthAmountOfGuests.put(month, b.getGuestNumber());
				monthBookingCount.put(month, 1);
			}
		}
		List<BookingGuestCountWrapper> result = new ArrayList<BookingGuestCountWrapper>();
		for (Map.Entry<Integer, Integer> entry : monthBookingCount.entrySet()) {
			//Double temp = new Double((entry.getValue().doubleValue() / 30) * 100);
			Float calculation = monthAmountOfGuests.get(entry.getKey()).floatValue() / entry.getValue();
			result.add(new BookingGuestCountWrapper(entry.getKey(),calculation));
		}
		for(Integer i=1;i<=12;i++){
			if(!monthBookingCount.containsKey(i)){
				result.add(new BookingGuestCountWrapper(i,0F));
			}
		}
		Collections.sort(result,new MonthComparator());
		return result;
	}
	public List<ReviewStarsWrapper> findReviewsAvgStars(Integer year,
			Long id) {
		List<Review> reviews = bookingRepo.findReviewsByPropertyAndYear(year,id);
		Map<Integer, Integer> monthReviewCount = new HashMap<Integer, Integer>();
		Map<Integer, Integer> monthReviewStars = new HashMap<Integer, Integer>(); 
		for(Review r : reviews){
			//there might be property owner's comments!
			if(r.getStars() == null)
				continue;
			LocalDate reviewDate = r.getAddingDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			Integer month = reviewDate.getMonthValue();
			if(monthReviewStars.containsKey(month)){
				Integer tempStarsCount = monthReviewStars.get(month);
				monthReviewStars.put(month, tempStarsCount + r.getStars());
				Integer tempReviewsCount = monthReviewCount.get(month);
				monthReviewCount.put(month, tempReviewsCount+1);
			}else{
				monthReviewStars.put(month, r.getStars());
				monthReviewCount.put(month, 1);
			}
		}
		List<ReviewStarsWrapper> result = new ArrayList<ReviewStarsWrapper>();
		for (Map.Entry<Integer, Integer> entry : monthReviewCount.entrySet()) {
			//Double temp = new Double((entry.getValue().doubleValue() / 30) * 100);
			Float calculation = monthReviewStars.get(entry.getKey()).floatValue() / entry.getValue();
			result.add(new ReviewStarsWrapper(entry.getKey(),calculation));
		}
		for(Integer i=1;i<=12;i++){
			if(!monthReviewCount.containsKey(i)){
				result.add(new ReviewStarsWrapper(i,0F));
			}
		}
		Collections.sort(result,new MonthComparator());
		return result;
	}
	public List<BookingLengthCount> findBookingAvgLength(Integer year, Long id) {
		List<Booking> bookings = bookingRepo.findBookingsByYearAndProperty(year, id);
		Map<Integer, Integer> monthBookingCount = new HashMap<Integer, Integer>();
		Map<Integer, Integer> monthBookingLength = new HashMap<Integer, Integer>();
		for(Booking b : bookings){
			LocalDate start = b.getCheckIn().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			LocalDate end = b.getCheckOut().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
			int duration = (int) ChronoUnit.DAYS.between(start, end);
			Integer month = start.getMonthValue();
			if(monthBookingLength.containsKey(month)){
				Integer tempBookingsDuration = monthBookingLength.get(month);
				monthBookingLength.put(month, tempBookingsDuration + duration);
				Integer tempBookingCount = monthBookingCount.get(month);
				monthBookingCount.put(month, tempBookingCount+1);
			}else{
				monthBookingLength.put(month, duration);
				monthBookingCount.put(month, 1);
			}
		}
		List<BookingAvgLength> bookingAvgLengthByMonth = new ArrayList<BookingAvgLength>();
		List<BookingCount> bookingCountByMonth = new ArrayList<BookingCount>();
		for (Map.Entry<Integer, Integer> entry : monthBookingCount.entrySet()) {
			//Double temp = new Double((entry.getValue().doubleValue() / 30) * 100);
			Integer calculation = (int) (monthBookingLength.get(entry.getKey()).floatValue() / entry.getValue());
			bookingAvgLengthByMonth.add(new BookingAvgLength(entry.getKey(),calculation));
			bookingCountByMonth.add(new BookingCount(entry.getKey(), entry.getValue()));
		}
		for(Integer i=1;i<=12;i++){
			if(!monthBookingCount.containsKey(i)){
				bookingCountByMonth.add(new BookingCount(i,0));
				bookingAvgLengthByMonth.add(new BookingAvgLength(i,0));
			}
		}
		bookingCountByMonth.sort(new MonthComparator());
		bookingAvgLengthByMonth.sort(new MonthComparator());
		List<BookingLengthCount> result = new ArrayList<BookingLengthCount>();
		result.add(new BookingLengthCount(bookingAvgLengthByMonth,bookingCountByMonth));
		return result;
	}
}