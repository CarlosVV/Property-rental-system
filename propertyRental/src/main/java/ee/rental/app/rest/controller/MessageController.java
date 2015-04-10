package ee.rental.app.rest.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.wrapper.MessageWrapper;
import ee.rental.app.core.service.MessageService;
import ee.rental.app.core.service.UserAccountService;
import ee.rental.app.core.service.exception.BookingNotFoundException;
import ee.rental.app.core.service.exception.NotAllowedException;
import ee.rental.app.rest.exception.ForbiddenException;
import ee.rental.app.rest.exception.NotFoundException;

@RestController
@RequestMapping("/messages")
public class MessageController {
	private static final Logger logger = LoggerFactory.getLogger(MessageController.class);
	@Autowired
	private UserAccountService userAccountService;
	@Autowired
	private MessageService messageService;
	@RequestMapping("/{bookingId}")
	public List<MessageWrapper> getMessages(@PathVariable(value="bookingId") Long bookingId){
		try{
			UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
			List<Message> messages = messageService.findMessages(bookingId,principal.getUsername());
			List<MessageWrapper> result = new ArrayList<MessageWrapper>();
			for(Message m : messages){
				result.add(new MessageWrapper(m));
			}
			logger.info("PLS"+messages.toString());
			return result;
		}catch(BookingNotFoundException e){
			throw new NotFoundException(e);
		}catch(NotAllowedException e){
			throw new ForbiddenException();
		}
	}
	@RequestMapping(method=RequestMethod.POST)
	public MessageWrapper addMessage(@RequestBody MessageWrapper m){
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		System.out.println("WHAT WE GOT:"+m);
		try{
			Message message = messageService.addMessage(m);
			return new MessageWrapper(message);
		}catch(NotAllowedException e){
			throw new ForbiddenException();
		}
	}
	@RequestMapping(method=RequestMethod.GET)
	public List<MessageWrapper> findUnreadMessages(){
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<Message> messages = messageService.findUnreadMessages(principal.getUsername());
		System.out.println("HOW MANY MSGS?"+messages.size());
		List<MessageWrapper> result = new ArrayList<MessageWrapper>();
		for(Message m : messages){
			result.add(new MessageWrapper(m));
		}
		System.out.println("UNREAD MSGS:"+result);
		return result;
	}
	@RequestMapping(value="/markRead/{bookingId}",method=RequestMethod.GET)
	public void markReadMessages(@PathVariable Long bookingId){
		UserDetails principal = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		try{
			messageService.markReadMessages(bookingId,principal.getUsername());
		}catch(NotAllowedException e){
			throw new ForbiddenException();
		}catch(BookingNotFoundException e){
			throw new NotFoundException();
		}
	}
}
