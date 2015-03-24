package ee.rental.app.core.repository;

import java.util.List;

import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.UserAccount;

public interface UserAccountRepo {
	public UserAccount createUserAccount(UserAccount userAccount);
	public List<UserAccount> findAllUserAccounts();
	public UserAccount findUserAccount(Long id);
	public UserAccount findUserAccountByUsername(String username);
}
