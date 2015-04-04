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

import ee.rental.app.core.model.Authority;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.UserAccountRepo;
@Repository
public class UserAccountRepoImpl implements UserAccountRepo{

	@Autowired
	private SessionFactory sessionFactory;
	public UserAccount createUserAccount(UserAccount userAccount) {
		Session session = sessionFactory.getCurrentSession();
		userAccount.setAuthority((Authority)session.get(Authority.class, 1L));
		session.flush();
		System.out.println("PLS DUDE"+userAccount);
		session.save(userAccount);
		session.flush();
		return userAccount;
	}
	public List<UserAccount> findAllUserAccounts() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT u FROM UserAccount u");
		return query.list();
	}
	public UserAccount findUserAccount(Long id) {
		Session session = sessionFactory.getCurrentSession();
		UserAccount uAccount = (UserAccount) sessionFactory.getCurrentSession().get(UserAccount.class, id);
		session.flush();
		return uAccount;
	}
	public UserAccount findUserAccountByUsername(String username){
		Session session = sessionFactory.getCurrentSession();
		Query query = session.createQuery("SELECT ua FROM UserAccount ua WHERE ua.username=:username");
		query.setParameter("username", username);
		UserAccount result = (UserAccount) query.uniqueResult();
		session.flush();
		return result;
	}
}