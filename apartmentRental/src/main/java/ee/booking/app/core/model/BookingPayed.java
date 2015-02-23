package ee.booking.app.core.model;

import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class BookingPayed {
	@Id @GeneratedValue
	private long id;
	private long bookingId;
	private Date payedDate;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public long getBookingId() {
		return bookingId;
	}
	public void setBookingId(long bookingId) {
		this.bookingId = bookingId;
	}
	public Date getPayedDate() {
		return payedDate;
	}
	public void setPayedDate(Date payedDate) {
		this.payedDate = payedDate;
	}
}
