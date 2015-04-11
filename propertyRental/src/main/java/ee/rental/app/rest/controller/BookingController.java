package ee.rental.app.rest.controller;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.wrapper.BookingWrapper;
import ee.rental.app.core.model.wrapper.CanSendReviews;
import ee.rental.app.core.model.wrapper.statistics.BookedDaysWrapper;
import ee.rental.app.core.model.wrapper.statistics.BookingAvgLength;
import ee.rental.app.core.model.wrapper.statistics.BookingGuestCountWrapper;
import ee.rental.app.core.model.wrapper.statistics.BookingLengthCount;
import ee.rental.app.core.model.wrapper.statistics.ReviewStarsWrapper;
import ee.rental.app.core.service.BookingService;
import ee.rental.app.core.service.exception.BookingNotFoundException;
import ee.rental.app.core.service.exception.BookingStatusNotFoundException;
import ee.rental.app.rest.exception.BadRequestException;
import ee.rental.app.rest.exception.ForbiddenException;
import ee.rental.app.rest.exception.NotFoundException;
import ee.rental.app.rest.response.Success;

@RestController
@RequestMapping("/bookings")
public class BookingController {
	@Autowired
	private BookingService bookingService;
	@RequestMapping(method=RequestMethod.POST)
	public ResponseEntity<Booking> addBooking(@RequestBody Booking booking){
		System.out.println("CHECKING BOOKING"+booking);
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		System.out.println(booking.getUserAccount().getUsername()+" hm "+principal.getUsername());
        if(booking.getUserAccount().getUsername().equals(principal.getUsername())){
        	booking.setBookedDate(new Date());
        	Booking createdBooking = bookingService.createBooking(booking);
			return new ResponseEntity<Booking>(createdBooking,HttpStatus.CREATED);
        }else{
        	throw new BadRequestException();
        }
	}
	@RequestMapping(value="/myBookings",method=RequestMethod.GET)
	public List<BookingWrapper> showMyBookings(){
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<Booking> bookings = bookingService.findBookingsByAccount(principal.getUsername());
		//System.out.println("hey there "+bookings);
		List<BookingWrapper> result = new ArrayList<BookingWrapper>();
		for(Booking b : bookings){
			BookingWrapper bw = new BookingWrapper(b);
			result.add(bw);
		}
		return result;
	}
	/**
	 * For messaging service
	 * @param year
	 * @return
	 */
	@RequestMapping(value="/myPropertiesBookings",method=RequestMethod.GET)
	public List<BookingWrapper> myPropertiesBookings(){
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<Booking> bookings = bookingService.findPropertiesBookingsByYear(principal.getUsername());
		List<BookingWrapper> result = new ArrayList<BookingWrapper>();
		for(Booking b : bookings){
			BookingWrapper bw = new BookingWrapper(b);
			result.add(bw);
		}
		return result;
	}
	@RequestMapping(value="/bookedDaysStatistics/{id}/{year}")
	public List<BookedDaysWrapper> showBookedDaysByMonth(@PathVariable Long id,@PathVariable Integer year){
		List<BookedDaysWrapper> result = bookingService.findBookedDaysPerMonthsInYearByProp(year, id);
		return result;
	}
	@RequestMapping(value="/bookingAvgGuestCountStatistics/{id}/{year}")
	public List<BookingGuestCountWrapper> showBookingGuestCountByMonth(@PathVariable Long id,@PathVariable Integer year){
		List<BookingGuestCountWrapper> result = bookingService.findBookingGuestCountPerMonthsInYearByProp(year,id);
		return result;
	}
	@RequestMapping(value="/bookingAvgRatingStatistics/{id}/{year}")
	public List<ReviewStarsWrapper> showBookingReviewStars(@PathVariable Long id,@PathVariable Integer year){
		List<ReviewStarsWrapper> result = bookingService.findReviewsAvgStars(year,id);
		return result;
	}
	@RequestMapping(value="/bookingAvgLengthStatistics/{id}/{year}")
	public List<BookingLengthCount> showBookingAvgLength(@PathVariable Long id,@PathVariable Integer year){
		List<BookingLengthCount> result = bookingService.findBookingAvgLength(year,id);
		return result;
	}
	@RequestMapping(value="/myPropertysBookings/{propertyId}")
	public List<BookingWrapper> findBookingsByProperty(@PathVariable Long propertyId){
		List<Booking> bookings = bookingService.findBookingsByProperty(propertyId);
		List<BookingWrapper> result = new ArrayList<BookingWrapper>();
		for(Booking b : bookings){
			BookingWrapper bw = new BookingWrapper(b);
			result.add(bw);
		}
		return result;
	}
	@RequestMapping(value="/bookingStatuses")
	public List<BookingStatus> findBookingsStatuses(){
		List<BookingStatus> result = bookingService.findBookingStatuses();
		return result;
	}
	@RequestMapping(value="/bookingStatus/{bookingId}/{statusId}",method=RequestMethod.GET)
	public boolean updateBookingStatus(@PathVariable Long bookingId,@PathVariable Long statusId){
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(principal.getUsername().equals(bookingService.findBooking(bookingId).getProperty().getUserAccount().getUsername())){
			boolean result = false;
			try{
				result = bookingService.updateBookingStatus(bookingId,statusId);
			}catch(BookingNotFoundException | BookingStatusNotFoundException e){
				throw new NotFoundException();
			}
			return result;
		}else{
			throw new ForbiddenException();
		}
	}
	@PreAuthorize("permitAll")
	@RequestMapping(value = "/canSendReviews/{propertyId}", method = RequestMethod.GET)
	public CanSendReviews canSendReviews(@PathVariable Long propertyId){
		Object principal =  SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(principal instanceof UserDetails){
			UserDetails account = (UserDetails) principal;
			return new CanSendReviews(bookingService.canSendReviews(account.getUsername(),propertyId));
		}
		return new CanSendReviews(false);
	}
}
