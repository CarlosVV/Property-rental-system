package ee.rental.app.core.repository.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.Message;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.MessageRepo;

@Repository
public class MessageRepoImpl implements MessageRepo{

	@Autowired
	private SessionFactory sessionFactory;
	public List<Message> findMessages(Long senderId, Long receiverId, Long bookingId){
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT m FROM Message m "
				+ "WHERE ("
				+ "(m.sender.id=? AND m.receiver.id=?) OR "
				+ "(m.sender.id=? AND m.receiver.id=?)"
				+ ") AND m.booking.id=:bookingId");
		query.setParameter(0, senderId);
		query.setParameter(1, receiverId);
		query.setParameter(2, receiverId);
		query.setParameter(3, senderId);
		query.setParameter("bookingId", bookingId);
		return query.list();
	}
}
