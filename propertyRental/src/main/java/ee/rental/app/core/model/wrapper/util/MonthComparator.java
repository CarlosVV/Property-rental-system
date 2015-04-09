package ee.rental.app.core.model.wrapper.util;

import java.util.Comparator;

import ee.rental.app.core.model.wrapper.statistics.StatisticsByMonth;

public class MonthComparator implements Comparator<StatisticsByMonth>{

	@Override
	public int compare(StatisticsByMonth b1, StatisticsByMonth b2){
		return b1.getMonth().compareTo(b2.getMonth());
	}
	
}
