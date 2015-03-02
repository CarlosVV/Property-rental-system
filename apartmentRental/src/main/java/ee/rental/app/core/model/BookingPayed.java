package ee.rental.app.core.model;

import java.sql.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
public class BookingPayed {
	@Id @GeneratedValue
	private Long id;
	@OneToOne(cascade=CascadeType.ALL)
	@PrimaryKeyJoinColumn
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
