package ee.rental.app.rest.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import ee.rental.app.core.model.wrapper.BookedDaysWrapper;
import ee.rental.app.core.model.wrapper.BookingWrapper;
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
			BookingWrapper bw = new BookingWrapper();
			bw.setPropertyId(b.getProperty().getId());
			bw.setPropertyTitle(b.getProperty().getTitle());
			bw.setCountry(b.getProperty().getCountry());
			bw.setCity(b.getProperty().getCity());
			bw.setAdministrativeArea(b.getProperty().getAdministrativeArea());
			bw.setBookingStatus(b.getBookingStatus().getName());
			//bw.setBookingPayed(bw.getBookingPayed());
			bw.setCheckIn(b.getCheckIn());
			bw.setCheckOut(b.getCheckOut());
			bw.setGuestNumber(b.getGuestNumber());
			bw.setPrice(b.getPrice());
			result.add(bw);
		}
		return result;
	}
	@RequestMapping(value="/bookedDays/{id}/{year}")
	public List<BookedDaysWrapper> showBookedDaysByMonth(@PathVariable Long id,@PathVariable Integer year){
		List<BookedDaysWrapper> result = bookingService.findBookedDaysPerMonthsInYearByProp(year, id);
		return result;
	}
	@RequestMapping(value="/myPropertysBookings/{propertyId}")
	public List<BookingWrapper> findBookingsByProperty(@PathVariable Long propertyId){
		List<Booking> bookings = bookingService.findBookingsByProperty(propertyId);
		List<BookingWrapper> result = new ArrayList<BookingWrapper>();
		for(Booking b : bookings){
			BookingWrapper bw = new BookingWrapper();
			bw.setPropertyId(b.getProperty().getId());
			bw.setPropertyTitle(b.getProperty().getTitle());
			bw.setCountry(b.getProperty().getCountry());
			bw.setCity(b.getProperty().getCity());
			bw.setAdministrativeArea(b.getProperty().getAdministrativeArea());
			bw.setBookingStatus(b.getBookingStatus().getName());
			bw.setBookingStatusId(b.getBookingStatus().getId());
			//bw.setBookingPayed(bw.getBookingPayed());
			bw.setUserAccountId(b.getUserAccount().getId());
			bw.setUserAccountUsername(b.getUserAccount().getUsername());
			bw.setCheckIn(b.getCheckIn());
			bw.setCheckOut(b.getCheckOut());
			bw.setGuestNumber(b.getGuestNumber());
			bw.setPrice(b.getPrice());
			result.add(bw);
		}
		System.out.println("PLS PLS"+result);
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
		if(principal.getUsername().equals(bookingService.findBooking(bookingId).getUserAccount().getUsername())){
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
}
