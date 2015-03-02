package ee.rental.app.core.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
public class Booking {
	@Id @GeneratedValue
	private Long id;
	@OneToOne(cascade=CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private UserAccount account;
	@OneToOne(cascade=CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private Apartment apartment;
	@OneToMany
	private List<Guest> guests;
	@OneToOne(cascade=CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private BookingStatus bookingStatus;
	@OneToOne(cascade=CascadeType.ALL)
	@PrimaryKeyJoinColumn
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
	public Apartment getApartment() {
		return apartment;
	}
	public void setApartment(Apartment apartment) {
		this.apartment = apartment;
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
