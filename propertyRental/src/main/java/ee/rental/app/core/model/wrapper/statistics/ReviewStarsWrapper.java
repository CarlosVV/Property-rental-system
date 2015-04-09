package ee.rental.app.core.model.wrapper.statistics;


public class ReviewStarsWrapper extends StatisticsByMonth{
	private Float averageStars;

	public ReviewStarsWrapper(Integer month,Float averageStars) {
		super(month);
		this.averageStars = averageStars;
	}

	public Float getAverageStars() {
		return averageStars;
	}

	public void setAverageStars(Float averageStars) {
		this.averageStars = averageStars;
	}
}
