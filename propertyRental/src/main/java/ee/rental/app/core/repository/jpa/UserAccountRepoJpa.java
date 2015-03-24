package ee.rental.app.core.repository.jpa;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.stereotype.Repository;

import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.UserAccountRepo;
@Repository
public class UserAccountRepoJpa implements UserAccountRepo{
	@PersistenceContext
	private EntityManager em;
	public UserAccount createUserAccount(UserAccount userAccount) {
		em.persist(userAccount);
		return userAccount;
	}
	public List<UserAccount> findAllUserAccounts() {
		Query query = em.createQuery("SELECT u FROM UserAccount u");
		return query.getResultList();
	}
	public UserAccount findUserAccount(Long id) {
		return em.find(UserAccount.class, id);
	}
	public UserAccount findUserAccountByUsername(String username){
		Query query = em.createQuery("SELECT ua FROM UserAccount ua WHERE ua.username=?1");
		query.setParameter(1, username);
		UserAccount result = (UserAccount) query.getSingleResult();
		return result;
	}
}