package ee.rental.app.core.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{
	@Autowired
	private AuthFailure authFailure;
	@Autowired
	private AuthSuccess authSuccess;
	@Autowired
	private EntryPointUnauthorizedHandler unauthorizedHandler;
	@Autowired
	private UserDetailsService userDetailsService;
	@Autowired
	public void configAuthBuilder(AuthenticationManagerBuilder builder) throws Exception{
		builder.userDetailsService(userDetailsService);
	}
	@Override
	protected void configure(HttpSecurity  http)
			throws Exception {
		http
			.csrf().disable()
			.exceptionHandling()
				.authenticationEntryPoint(unauthorizedHandler)
				.and()
			.formLogin()
				.successHandler(authSuccess)
				.failureHandler(authFailure)
			.and()
			.authorizeRequests()
				.antMatchers("/**")
					.permitAll()
			.and()
				.logout();
	}
}
