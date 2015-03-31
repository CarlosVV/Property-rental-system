package ee.rental.app.core.security;

import java.util.List;

import org.springframework.security.core.GrantedAuthority;

import ee.rental.app.core.model.Authority;

public class GrantedAuthorityImpl implements GrantedAuthority{
	private Long userId;
	private String authority;
	public GrantedAuthorityImpl(){}
	public GrantedAuthorityImpl(Long userId, String authority) {
		this.userId = userId;
		this.authority = authority;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public void setAuthority(String authority){
		this.authority = authority;
	}
	public String getAuthority() {
		return authority;
	}
}