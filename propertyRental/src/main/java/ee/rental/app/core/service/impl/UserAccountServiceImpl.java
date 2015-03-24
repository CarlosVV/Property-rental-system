package ee.rental.app.core.service.impl;

import java.util.List;

import javax.security.auth.login.AccountException;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.UserAccountService;
import ee.rental.app.core.service.exception.UserAccountExistsException;

@Service
@Transactional
public class UserAccountServiceImpl implements UserAccountService{
	@Autowired
	private UserAccountRepo userAccountRepo;
	public UserAccount createUserAccount(UserAccount userAccount) {
		UserAccount account = userAccountRepo.findUserAccountByUsername(userAccount.getName());
		if(account != null){
			throw new UserAccountExistsException();
		}
		return userAccountRepo.createUserAccount(account);
	}

	public List<UserAccount> findAllUserAccounts() {
		return userAccountRepo.findAllUserAccounts();
	}

	public UserAccount findUserAccountByUsername(String username) {
		return userAccountRepo.findUserAccountByUsername(username);
	}

}
