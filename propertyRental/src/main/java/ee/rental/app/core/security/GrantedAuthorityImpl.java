package ee.rental.app.core.security;

import org.springframework.security.core.GrantedAuthority;

public class GrantedAuthorityImpl implements GrantedAuthority{
	private Long userId;
	private String authority;
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