package ee.rental.app.rest.controller;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import eu.medsea.mimeutil.MimeType;
import eu.medsea.mimeutil.MimeUtil;

import org.hibernate.jpa.criteria.predicate.ExistsPredicate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.PropertyFacility;
import ee.rental.app.core.model.PropertyType;
import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.Review;
import ee.rental.app.core.model.UnavailableDate;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.wrapper.PropertyQueryWrapper;
import ee.rental.app.core.model.wrapper.PropertyWrapper;
import ee.rental.app.core.model.wrapper.ReviewWrapper;
import ee.rental.app.core.model.wrapper.UnavailableDatesForPublic;
import ee.rental.app.core.service.BookingService;
import ee.rental.app.core.service.PropertyService;
import ee.rental.app.core.service.MessageService;
import ee.rental.app.core.service.UserAccountService;
import ee.rental.app.core.service.exception.NotAllowedException;
import ee.rental.app.core.service.exception.PropertyNotFoundException;
import ee.rental.app.core.service.exception.PropertiesNotFoundException;
import ee.rental.app.core.service.exception.BookingNotFoundException;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;
import ee.rental.app.rest.exception.BadRequestException;
import ee.rental.app.rest.exception.ForbiddenException;
import ee.rental.app.rest.exception.NotFoundException;
import ee.rental.app.rest.response.ErrorResponse;
import ee.rental.app.rest.response.Success;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {
	private static final Logger logger = LoggerFactory.getLogger(PropertyController.class);
	@Autowired
	private UserAccountService userAccountService;
	@Autowired
	private PropertyService propertyService;
	@Autowired
	private BookingService bookingService;
	@PreAuthorize("permitAll")
	@RequestMapping(value = "/{id}", method = RequestMethod.GET)
	public Property getProperty(@PathVariable("id") Long id){
		try{
			Property property = propertyService.findProperty(id);
			logger.info("WORKING "+property);
			return property;
		}catch(PropertyNotFoundException e){
			logger.info("thrown");
			throw new NotFoundException(e);
		}
	}
	@RequestMapping(value = "/myProperties", method = RequestMethod.GET)
	public List<PropertyWrapper> getPropertiesByOwner() throws ParseException{
		Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(principal instanceof UserDetails) {
	        UserDetails details = (UserDetails)principal;
	    	logger.info("and "+details);
			List<Property> properties = propertyService.findPropertiesByOwner(details.getUsername());
			List<PropertyWrapper> result = new ArrayList<PropertyWrapper>();
			for(Property p : properties){
				result.add(new PropertyWrapper(p));
			}
			//logger.info("WORKING "+properties);
			return result;
	    }else{
	    	throw new ForbiddenException();
	    }
	}
	@RequestMapping(value="/{id}", method=RequestMethod.PUT)
	public Property updateProperty(@PathVariable("id") Long id, @RequestBody Property property){
			logger.info("OKAY UPDATING "+property);
			UserDetails principal = (UserDetails)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			Property checkProperty = propertyService.findProperty(property.getId());
			if(principal.getUsername().equals(checkProperty.getUserAccount().getUsername())){
				propertyService.updateProperty(property);
				return property;
			}else{
				throw new ForbiddenException();
			}
		
	}
	@RequestMapping(method=RequestMethod.POST)
	public ResponseEntity<Property> addProperty(@RequestBody Property property){
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		logger.info(""+principal);
        if(property.getUserAccount().getUsername().equals(principal.getUsername())){
        	property.setCreatedDate(new Date());
			Property createdProperty = propertyService.addProperty(property);
			return new ResponseEntity<Property>(createdProperty,HttpStatus.CREATED);
        }else{
        	throw new BadRequestException();
        }
        
	}
	@PreAuthorize("permitAll")
	@RequestMapping(value = "/search", method = RequestMethod.POST)
	public List<PropertyWrapper> queryApartments(@RequestBody PropertyQueryWrapper query){
		List<Property> result = propertyService.queryProperties(query);
		List<PropertyWrapper> finalResult = new ArrayList<PropertyWrapper>();
		for(Property p : result){
			finalResult.add(new PropertyWrapper(p));
		}
		return finalResult;
	}
	@PreAuthorize("permitAll")
	@RequestMapping(value = "/propertyTypes", method = RequestMethod.GET)
	public List<PropertyType> getApartmentTypes(){
		List<PropertyType> result = propertyService.findAllPropertyTypes();
		return result;
	}
	@PreAuthorize("permitAll")
	@RequestMapping(value = "/propertyFacilities", method = RequestMethod.GET)
	public List<PropertyFacility> propertyFacilityList(){
		List<PropertyFacility> result = propertyService.findPropertyFacilities();
		return result;
	}
	@ResponseStatus(HttpStatus.OK)
    @RequestMapping(value = "/uploadPhoto", method=RequestMethod.POST)
    public ResponseEntity upload(@RequestParam("file") MultipartFile uploadedFile, HttpServletRequest request) throws IOException {
		
        if (!uploadedFile.isEmpty()) {
        	System.out.println("NOT EMPTY");
			byte[] bytes = uploadedFile.getBytes();
			
            
			MimeUtil.registerMimeDetector("eu.medsea.mimeutil.detector.MagicMimeMimeDetector");
			Collection<MimeType> mimeTypes = MimeUtil.getMimeTypes(bytes);
			List<MimeType> mimeTypesList = new ArrayList<MimeType>(mimeTypes);
			String mimeType = "";
			for(MimeType mime : mimeTypesList){
				mimeType += mime.toString();
			}
			String filePath = request.getServletContext().getRealPath("")+"/app/uploads/photos/";
			logger.info("UPLOADING TO "+filePath);
			//String filePath = "E:/Java/fileUploads/propertyRentalApp/";
			String extension = "";
			if(mimeType.equals("image/jpeg") || mimeType.equals("image/pjpeg")){
				extension += ".jpg";
			}else{
				if(mimeType.equals("image/gif")){
					extension += ".gif";
				}else{
					if(mimeType.equals("image/png"))
						extension += ".png";
					else{
						return new ResponseEntity<ErrorResponse>(new ErrorResponse("File is not an image"),HttpStatus.UNPROCESSABLE_ENTITY);
					}
				}
			}
			//filePath += fileName;
			String fileName = "";
			Random generator = new Random(System.currentTimeMillis());
			Integer random = generator.nextInt(Integer.MAX_VALUE);
			fileName = Integer.toString(random);
			boolean exists = true;
			while(exists){
				String temp = filePath + fileName + extension;
				if(new File(temp).exists()){
					random = generator.nextInt(Integer.MAX_VALUE);
					fileName = Integer.toString(random);
					exists = true;
				}else{
					exists = false;
				}
			}
			File file = new File(filePath+fileName+extension);
			FileOutputStream fos = new FileOutputStream(file);
			fos.write(bytes);
			fos.close();
			return new ResponseEntity<Success>(new Success(fileName+extension),HttpStatus.CREATED);
        }
    	System.out.println(" EMPTY");
        return new ResponseEntity<ErrorResponse>(new ErrorResponse("Not file sent"),HttpStatus.BAD_REQUEST);
    }
	@PreAuthorize("permitAll")
	@RequestMapping(value = "/reviews/{id}", method = RequestMethod.GET)
	public List<ReviewWrapper> showPropertyReviews(@PathVariable Long id){
		List<Review> reviews = propertyService.findReviewsByPropertyId(id);
		List<ReviewWrapper> result = new ArrayList<ReviewWrapper>();
		for(Review review : reviews){
			result.add(new ReviewWrapper(review));
		}
		return result;
	}
	@RequestMapping(value = "/reviews/{id}", method = RequestMethod.POST)
	public ReviewWrapper addPropertyReview(@PathVariable Long id,@RequestBody ReviewWrapper review){
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		if(review.getParentReviewId() != null){
			Review r = propertyService.findReviewById(review.getParentReviewId());
			if(r == null || !bookingService.canSendReviews(principal.getUsername(), id)){
				throw new BadRequestException();
			}
		}
		review.setUsername(principal.getUsername());
		review.setPropertyId(id);
		return new ReviewWrapper(propertyService.addReview(review));
	}
	@RequestMapping(value="/reviews/{id}",method=RequestMethod.DELETE)
	public void deletePropertyReview(@PathVariable Long id){
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		try{
			propertyService.deleteReview(id,principal.getUsername());
		}catch(NotAllowedException e){
			throw new ForbiddenException();
		}
	}
	
	
	
}
