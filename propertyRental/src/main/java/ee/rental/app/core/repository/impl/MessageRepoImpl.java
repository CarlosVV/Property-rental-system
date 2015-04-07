package ee.rental.app.core.repository.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Query;
import org.hibernate.Session;
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
	public List<Message> findMessages(Long bookingId){
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT m FROM Message m "
				+ "WHERE m.booking.id=:bookingId");
		query.setParameter("bookingId", bookingId);
		List<Message> result = (List<Message>) query.list();
		session.flush();
		return result;
	}
	public Message addMessage(Message message) {
		Session session = sessionFactory.getCurrentSession();
		session.persist(message);
		session.flush();
		return message;
	}
}