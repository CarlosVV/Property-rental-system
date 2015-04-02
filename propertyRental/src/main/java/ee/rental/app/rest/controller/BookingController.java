package ee.rental.app.rest.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.wrapper.BookingWrapper;
import ee.rental.app.core.service.BookingService;
import ee.rental.app.rest.exception.BadRequestException;

@RestController
@RequestMapping("/bookings")
public class BookingController {
	@Autowired
	private BookingService bookingService;
	@RequestMapping(method=RequestMethod.POST)
	public ResponseEntity<Booking> addBooking(@RequestBody Booking booking){
		System.out.println("CHECKING BOOKING"+booking);
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
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
	public Map<Integer,Integer> showBookedDaysByMonth(@PathVariable Long id,@PathVariable Integer year){
		Map<Integer, Integer> result = bookingService.findBookedDaysPerMonthsInYearByProp(year, id);
		return result;
	}
}
