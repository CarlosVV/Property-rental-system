package ee.rental.app.core.service;

import java.util.List;

import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.model.wrapper.MessageWrapper;

public interface MessageService {
	public List<Message> findMessages(Long senderId, String string);
	public Message addMessage(MessageWrapper m);
	public List<Message> findUnreadMessages(String username);
	public void markReadMessages(Long bookingId,String username);
	public List<Message> findMessagesByReceiverAndBooking(Long bookingId,String username);
}
