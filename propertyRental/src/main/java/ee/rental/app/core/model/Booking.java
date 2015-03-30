package ee.rental.app.core.model;

import java.util.Date;
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
	private UserAccount userAccount;
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	private Property property;
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	private BookingStatus bookingStatus;
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	private BookingPayed bookingPayed;
	private Date bookingStart;
	private Date bookingEnd;
	public Property getProperty() {
		return property;
	}
	public void setProperty(Property property) {
		this.property = property;
	}
	public Date getBookingStart() {
		return bookingStart;
	}
	public void setBookingStart(Date bookingStart) {
		this.bookingStart = bookingStart;
	}
	public Date getBookingEnd() {
		return bookingEnd;
	}
	public void setBookingEnd(Date bookingEnd) {
		this.bookingEnd = bookingEnd;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public UserAccount getUserAccount() {
		return userAccount;
	}
	public void setUserAccount(UserAccount userAccount) {
		this.userAccount = userAccount;
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
