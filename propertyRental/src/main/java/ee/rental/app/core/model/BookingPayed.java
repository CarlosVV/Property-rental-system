package ee.rental.app.core.model;

import java.sql.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class,property="atbookingPayedId")
public class BookingPayed {
	@Id @GeneratedValue
	private Long id;
	@OneToOne
	//@PrimaryKeyJoinColumn
	@JsonIgnore
	private Booking booking;
	private Date payedDate;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Booking getBooking() {
		return booking;
	}
	public void setBooking(Booking booking) {
		this.booking = booking;
	}
	public Date getPayedDate() {
		return payedDate;
	}
	public void setPayedDate(Date payedDate) {
		this.payedDate = payedDate;
	}
}
