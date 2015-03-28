package ee.rental.app.core.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.BookingRepo;
import ee.rental.app.core.repository.MessageRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.MessageService;
import ee.rental.app.core.service.exception.BookingNotFoundException;
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
	public List<Message> findMessages(Long senderId, Long receiverId, Long bookingId) {
		UserAccount sender = userAccountRepo.findUserAccount(senderId);
		UserAccount receiver = userAccountRepo.findUserAccount(receiverId);
		if(sender == null || receiver == null)
			throw new UserAccountNotFoundException();
		Booking booking = bookingRepo.findBooking(bookingId);
		if(booking == null)
			throw new BookingNotFoundException();
		return messageRepo.findMessages(senderId, receiverId, bookingId);
	}

}
