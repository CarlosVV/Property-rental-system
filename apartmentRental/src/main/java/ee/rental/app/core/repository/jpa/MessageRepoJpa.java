package ee.rental.app.core.repository.jpa;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.MessageRepo;

@Repository
public class MessageRepoJpa implements MessageRepo{
	@PersistenceContext
	private EntityManager em;
	public List<Message> findMessages(Long senderId, Long receiverId, Long bookingId){
		Query query = em.createQuery("SELECT m FROM Message m "
				+ "WHERE ("
				+ "(m.sender.id=?1 AND m.receiver.id=?2) OR "
				+ "(m.sender.id=?3 AND m.receiver.id=?4)"
				+ ") AND m.booking.id=:bookingId");
		query.setParameter(1, senderId);
		query.setParameter(2, receiverId);
		query.setParameter(3, receiverId);
		query.setParameter(4, senderId);
		query.setParameter("bookingId", bookingId);
		return query.getResultList();
	}
}
