package ee.rental.app.core.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.service.UserAccountService;

@Component
public class UserDetailServiceImpl implements UserDetailsService{
	@Autowired
	private UserAccountService service;
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserAccount account = service.findUserAccountByUsername(username);
        System.out.println("DOES IT EVEN WORK? "+username);
        if(account == null) {
            throw new UsernameNotFoundException("no user found with " + username);
        }
        return new AccountUserDetails(account);
    }
}
