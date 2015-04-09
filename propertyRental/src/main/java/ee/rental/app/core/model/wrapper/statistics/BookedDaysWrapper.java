package ee.rental.app.core.model.wrapper.statistics;


public class BookedDaysWrapper extends StatisticsByMonth{
	private Integer bookedDays;
	public BookedDaysWrapper(){}
	public BookedDaysWrapper(Integer month, Integer bookedDays) {
		super(month);
		this.bookedDays = bookedDays;
	}
	public Integer getBookedDays() {
		return bookedDays;
	}
	public void setBookedDays(Integer bookedDays) {
		this.bookedDays = bookedDays;
	}
}
