package ee.rental.app.core.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class UserAccount {
	@Id @GeneratedValue
	private Long id;
	private String username;
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return username;
	}

	public void setName(String name) {
		this.username = name;
	}
	
}
