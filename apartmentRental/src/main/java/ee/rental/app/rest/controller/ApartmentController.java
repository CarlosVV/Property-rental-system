package ee.rental.app.rest.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ee.rental.app.core.model.Message;
import ee.rental.app.core.service.MessageService;
import ee.rental.app.core.service.UserAccountService;
import ee.rental.app.core.service.exception.BookingNotFoundException;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;
import ee.rental.app.rest.exception.NotFoundException;

@RestController
public class ApartmentController {
	private static final Logger logger = LoggerFactory.getLogger(ApartmentController.class);
	@Autowired
	private UserAccountService userAccountService;
	@Autowired
	private MessageService messageService;
	@RequestMapping("/getMessages")
	public List<Message> greeting(@RequestParam(value="senderId") Long senderId,
			@RequestParam(value="receiverId") Long receiverId,
			@RequestParam(value="bookingId") Long bookingId){
		try{
			List<Message> messages = messageService.findMessages(senderId, receiverId, bookingId);
			logger.info(messages.toString());
			return messages;
		}catch(UserAccountNotFoundException | BookingNotFoundException e){
			throw new NotFoundException(e);
		}
		/*Message result = new Message();
		result.setId(1L);
		result.setMessage("SADSA");
		UserAccount u1 = new UserAccount();
		u1.setId(1L);
		UserAccount u2 = new UserAccount();
		u2.setId(2L);
		result.setReceiver(u1);
		result.setSender(u2);
		return result;*/
	}
}
