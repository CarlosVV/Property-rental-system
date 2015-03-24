package ee.rental.app.core.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class,property="@bookingId")
public class Booking {
	@Id @GeneratedValue
	private Long id;
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	private UserAccount account;
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	private Property property;
	@OneToMany(mappedBy="booking")
	private List<Guest> guests;
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	private BookingStatus bookingStatus;
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	private BookingPayed bookingPayed;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public UserAccount getAccount() {
		return account;
	}
	public void setAccount(UserAccount account) {
		this.account = account;
	}
	public Property getApartment() {
		return property;
	}
	public void setApartment(Property property) {
		this.property = property;
	}
	public List<Guest> getGuests() {
		return guests;
	}
	public void setGuests(List<Guest> guests) {
		this.guests = guests;
	}
	public BookingStatus getBookingStatus() {
		return bookingStatus;
	}
	public void setBookingStatus(BookingStatus bookingStatus) {
		this.bookingStatus = bookingStatus;
	}
	public BookingPayed getBookingPayed() {
		return bookingPayed;
	}
	public void setBookingPayed(BookingPayed bookingPayed) {
		this.bookingPayed = bookingPayed;
	}
}
