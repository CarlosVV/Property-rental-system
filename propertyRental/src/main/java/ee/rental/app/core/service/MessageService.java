package ee.rental.app.core.service;

import java.util.List;

import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.UserAccount;

public interface MessageService {
	public List<Message> findMessages(Long senderId, Long receiverId, Long bookingId);
}
