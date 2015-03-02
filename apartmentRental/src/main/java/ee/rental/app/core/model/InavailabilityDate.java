package ee.rental.app.core.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
public class InavailabilityDate {
	@Id @GeneratedValue
	private Long id;
	//@JoinColumn(name="apartmentId")
	@OneToOne(cascade=CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private Apartment apartment;
	private Date date;
}
