package ee.rental.app.core.model.wrapper.statistics;

public class BookingCount extends StatisticsByMonth{
	private Integer bookingCount;

	public Integer getBookingCount() {
		return bookingCount;
	}

	public void setBookingCount(Integer bookingCount) {
		this.bookingCount = bookingCount;
	}

	public BookingCount(Integer month,Integer bookingCount) {
		super(month);
		this.bookingCount = bookingCount;
	}
	
}
