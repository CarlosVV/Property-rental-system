package ee.booking.app.core.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class Room {
	@Id @GeneratedValue
	private long id;
	private int sleepingPeopleCount;
	private 
}
