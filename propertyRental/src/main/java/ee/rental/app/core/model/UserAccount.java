package ee.rental.app.core.model;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class,property="@userAccountId")
public class UserAccount {
	@Override
	public String toString() {
		return "UserAccount [id=" + id + ", username=" + username
				+ ", password=" + password 
				+ ", bookings=" + bookings + "]";
	}

	@Id @GeneratedValue
	private Long id;
	private String username;
	private String password;
	@OneToMany(mappedBy="userAccount")
	private List<Booking> bookings;
	@OneToOne(mappedBy="accountUser")
	public List<Booking> getBookings() {
		return bookings;
	}

	public void setBookings(List<Booking> bookings) {
		this.bookings = bookings;
	}


	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
	
	
}
