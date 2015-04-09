package ee.rental.app.core.model.wrapper.statistics;

public class BookingAvgLength extends StatisticsByMonth{
	private Integer averageLength;
	public BookingAvgLength(){}
	public BookingAvgLength(Integer month,Integer averageLength) {
		super(month);
		this.averageLength = averageLength;
	}
	public Integer getAverageLength() {
		return averageLength;
	}
	public void setAverageLength(Integer averageLength) {
		this.averageLength = averageLength;
	}
}
