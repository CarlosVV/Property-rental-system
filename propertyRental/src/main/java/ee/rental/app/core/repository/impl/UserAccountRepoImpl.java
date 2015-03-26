package ee.rental.app.core.repository.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.hibernate.Query;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.UserAccountRepo;
@Repository
@Transactional
public class UserAccountRepoImpl implements UserAccountRepo{

	@Autowired
	private SessionFactory sessionFactory;
	public UserAccount createUserAccount(UserAccount userAccount) {
		sessionFactory.getCurrentSession().save(userAccount);
		return userAccount;
	}
	public List<UserAccount> findAllUserAccounts() {
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT u FROM UserAccount u");
		return query.list();
	}
	public UserAccount findUserAccount(Long id) {
		return (UserAccount) sessionFactory.getCurrentSession().get(UserAccount.class, id);
	}
	public UserAccount findUserAccountByUsername(String username){
		Query query = sessionFactory.getCurrentSession().createQuery("SELECT ua FROM UserAccount ua WHERE ua.username=?1");
		query.setParameter(0, username);
		UserAccount result = (UserAccount) query.uniqueResult();
		return result;
	}
}