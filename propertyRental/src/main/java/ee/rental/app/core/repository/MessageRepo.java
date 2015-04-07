package ee.rental.app.core.repository;

import java.util.List;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.UserAccount;

public interface MessageRepo {
	public List<Message> findMessages(Long senderId);

	public Message addMessage(Message message);
}
