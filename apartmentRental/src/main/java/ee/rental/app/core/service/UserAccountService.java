package ee.rental.app.core.service;

import java.util.List;

import ee.rental.app.core.model.UserAccount;

public interface UserAccountService {
	public UserAccount createUserAccount(UserAccount userAccount);
	public List<UserAccount> findAllUserAccounts();
	public UserAccount findUserAccountByUsername(String username);
}
