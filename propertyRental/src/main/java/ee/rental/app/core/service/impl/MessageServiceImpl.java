package ee.rental.app.core.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.wrapper.MessageWrapper;
import ee.rental.app.core.repository.BookingRepo;
import ee.rental.app.core.repository.MessageRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.MessageService;
import ee.rental.app.core.service.exception.BookingNotFoundException;
import ee.rental.app.core.service.exception.NotAllowedException;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;

@Service
@Transactional
public class MessageServiceImpl implements MessageService{
	@Autowired
	private MessageRepo messageRepo;
	@Autowired
	private UserAccountRepo userAccountRepo;
	@Autowired
	private BookingRepo bookingRepo;
	public List<Message> findMessages(Long bookingId, String username) {
		Booking booking = bookingRepo.findBooking(bookingId);
		if(booking == null)
			throw new BookingNotFoundException();
		if(!booking.getUserAccount().getUsername().equals(username) && !booking.getProperty().getUserAccount().getUsername().equals(username)){
			throw new NotAllowedException();
		}
		return messageRepo.findMessages(bookingId);
	}
	public Message addMessage(MessageWrapper m) {
		Message message = new Message();
		Booking booking = bookingRepo.findBooking(m.getBookingId());
		if(booking == null)
			throw new BookingNotFoundException();
		boolean firstCombination = booking.getUserAccount().getUsername().equals(m.getReceiverUsername()) && booking.getProperty().getUserAccount().getUsername().equals(m.getSenderUsername());
		boolean secondCombination = booking.getUserAccount().getUsername().equals(m.getSenderUsername()) && booking.getProperty().getUserAccount().getUsername().equals(m.getReceiverUsername());
		if(!firstCombination && !secondCombination)
			throw new NotAllowedException();
		message.setBooking(booking);
		message.setMessage(m.getMessage());
		message.setSentDate(new Date());
		message.setReceiverRead(false);
		if(firstCombination){
			message.setReceiver(booking.getUserAccount());
			message.setSender(booking.getProperty().getUserAccount());
		}else{
			message.setReceiver(booking.getProperty().getUserAccount());
			message.setSender(booking.getUserAccount());
		}
		return messageRepo.addMessage(message);
	}
	public List<Message> findUnreadMessages(String username) {
		return messageRepo.findUnreadMessages(username);
	}
	public List<Message> findMessagesByReceiverAndBooking(Long bookingId,String username){
		return messageRepo.findMessagesByReceiver(bookingId,username);
	}
	public void markReadMessages(Long bookingId,String username) {
		Booking booking = bookingRepo.findBooking(bookingId);
		if(booking == null)
			throw new BookingNotFoundException();
		List<Message> messages = findMessagesByReceiverAndBooking(bookingId,username);
		messageRepo.markMessagesRead(messages);
	}

}
