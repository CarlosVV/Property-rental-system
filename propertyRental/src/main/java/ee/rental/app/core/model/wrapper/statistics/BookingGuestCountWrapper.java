package ee.rental.app.core.model.wrapper.statistics;


public class BookingGuestCountWrapper extends StatisticsByMonth{
	private Float averageGuestCount;
	public BookingGuestCountWrapper(){}
	public BookingGuestCountWrapper(Integer month, Float averageGuestCount) {
		super(month);
		this.averageGuestCount = averageGuestCount;
	}
	public Float getAverageGuestCount() {
		return averageGuestCount;
	}
	public void setAverageGuestCount(Float averageGuestCount) {
		this.averageGuestCount = averageGuestCount;
	}

}
