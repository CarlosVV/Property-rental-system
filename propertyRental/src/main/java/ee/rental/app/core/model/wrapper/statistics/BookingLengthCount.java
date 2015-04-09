package ee.rental.app.core.model.wrapper.statistics;

import java.util.List;

public class BookingLengthCount {
	List<BookingAvgLength> bookingAvgLengthByMonth;
	List<BookingCount> bookingCountByMonth;
	public BookingLengthCount(){}
	public BookingLengthCount(List<BookingAvgLength> bookingAvgLengthByMonth,
			List<BookingCount> bookingCountByMonth) {
		this.bookingAvgLengthByMonth = bookingAvgLengthByMonth;
		this.bookingCountByMonth = bookingCountByMonth;
	}
	public List<BookingAvgLength> getBookingAvgLengthByMonth() {
		return bookingAvgLengthByMonth;
	}
	public void setBookingAvgLengthByMonth(
			List<BookingAvgLength> bookingAvgLengthByMonth) {
		this.bookingAvgLengthByMonth = bookingAvgLengthByMonth;
	}
	public List<BookingCount> getBookingCountByMonth() {
		return bookingCountByMonth;
	}
	public void setBookingCountByMonth(List<BookingCount> bookingCountByMonth) {
		this.bookingCountByMonth = bookingCountByMonth;
	}
	
}
