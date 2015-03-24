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

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.service.PropertyService;
import ee.rental.app.core.service.MessageService;
import ee.rental.app.core.service.UserAccountService;
import ee.rental.app.core.service.exception.PropertyNotFoundException;
import ee.rental.app.core.service.exception.PropertiesNotFoundException;
import ee.rental.app.core.service.exception.BookingNotFoundException;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;
import ee.rental.app.rest.exception.NotFoundException;

@RestController
@RequestMapping("/properties")
public class PropertyController {
	private static final Logger logger = LoggerFactory.getLogger(PropertyController.class);
	@Autowired
	private UserAccountService userAccountService;
	@Autowired
	private PropertyService propertyService;
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Property getApartment(@PathVariable("id") Long id){
		try{
			Property property = propertyService.findApartment(id);
			logger.info("WORKING "+property);
			return property;
		}catch(PropertyNotFoundException e){
			logger.info("thrown");
			throw new NotFoundException(e);
		}
	}///query
	@RequestMapping(value = "/search", method = RequestMethod.POST)
	public List<Property> queryApartments(@RequestBody PropertyQueryWrapper query){
		logger.info("GOT IT "+query);
		List<Property> result = propertyService.queryApartments(query);
		logger.info("ANSWER:"+result);
		return result;
	}
	@RequestMapping(value = "/propertyTypes", method = RequestMethod.GET)
	public List<PropertyType> getApartmentTypes(){
		List<PropertyType> result = propertyService.findAllApartmentTypes();
		logger.info("ANSWER:"+result);
		return result;
	}
	
}
