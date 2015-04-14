package ee.rental.app.rest.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.service.UserAccountService;
import ee.rental.app.core.service.exception.UserAccountExistsException;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;
import ee.rental.app.rest.exception.ConflictException;
import ee.rental.app.rest.response.Success;

@RestController
@RequestMapping("/api/accounts")
public class UserAccountController {
	private static final Logger logger = LoggerFactory.getLogger(UserAccountController.class);
	@Autowired
	private UserAccountService userAccountService;
	@PreAuthorize("permitAll")
	@RequestMapping(method=RequestMethod.POST)
	public ResponseEntity<UserAccount> registerAccount(@RequestBody UserAccount userAccount){
		try{
			System.out.println("WTF"+userAccount);
			UserAccount user = userAccountService.createUserAccount(userAccount);
			return new ResponseEntity<UserAccount>(user,HttpStatus.CREATED);
		}catch(UserAccountExistsException e){
			throw new ConflictException(e);
		}
	}
	@PreAuthorize("permitAll")
	@RequestMapping(value="/username/{username}",method = RequestMethod.GET)
	public void findAccountByUsername(
			@PathVariable String username) {
		if(username != null){
			try{
				UserAccount userAccount = userAccountService.findUserAccountByUsername(username);
			}catch(UserAccountNotFoundException e){
				return;
			}
			throw new ConflictException();
		}
	}
	@PreAuthorize("permitAll")
	@RequestMapping(value = "/{accountId}", method = RequestMethod.GET)
	public ResponseEntity<UserAccount> getAccount(
			@PathVariable Long accountId) {
		UserAccount userAccount = userAccountService.findUserAccountById(accountId);
		if (userAccount != null) {
			return new ResponseEntity<UserAccount>(userAccount, HttpStatus.OK);
		} else {
			return new ResponseEntity<UserAccount>(HttpStatus.NOT_FOUND);
		}
	}
}
