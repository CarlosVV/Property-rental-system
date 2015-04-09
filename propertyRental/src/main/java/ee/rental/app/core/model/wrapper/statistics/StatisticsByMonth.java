package ee.rental.app.core.model.wrapper.statistics;

public abstract class StatisticsByMonth {
	private Integer month;
	public StatisticsByMonth(){}
	public StatisticsByMonth(Integer month) {
		this.month = month;
	}

	public Integer getMonth() {
		return month;
	}

	public void setMonth(Integer month) {
		this.month = month;
	}
}
