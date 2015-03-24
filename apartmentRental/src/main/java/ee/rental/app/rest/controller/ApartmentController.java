package ee.rental.app.rest.controller;

import java.util.Date;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ee.rental.app.core.model.Apartment;
import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.wrapper.ApartmentQueryWrapper;
import ee.rental.app.core.service.ApartmentService;
import ee.rental.app.core.service.MessageService;
import ee.rental.app.core.service.UserAccountService;
import ee.rental.app.core.service.exception.ApartmentNotFoundException;
import ee.rental.app.core.service.exception.ApartmentsNotFoundException;
import ee.rental.app.core.service.exception.BookingNotFoundException;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;
import ee.rental.app.rest.exception.NotFoundException;

@RestController
@RequestMapping("/apartments")
public class ApartmentController {
	private static final Logger logger = LoggerFactory.getLogger(ApartmentController.class);
	@Autowired
	private UserAccountService userAccountService;
	@Autowired
	private ApartmentService apartmentService;
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Apartment getApartment(@PathVariable("id") Long id){
		try{
			Apartment apartment = apartmentService.findApartment(id);
			logger.info("WORKING "+apartment);
			return apartment;
		}catch(ApartmentNotFoundException e){
			logger.info("thrown");
			throw new NotFoundException(e);
		}
	}///query
	@RequestMapping(value = "/search", method = RequestMethod.POST)
	public List<Apartment> queryApartments(@RequestBody ApartmentQueryWrapper query){
		logger.info("GOT IT "+query);
		List<Apartment> result = apartmentService.queryApartments(query);
		logger.info("ANSWER:"+result);
		return result;
	}
}
