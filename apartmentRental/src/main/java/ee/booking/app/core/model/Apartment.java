package ee.booking.app.core.model;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

@Entity
public class Apartment {
	@Id @GeneratedValue
	private long id;
	@JoinColumn(name="ownerId")
	private Account owner;
	private String country;
	private String city;
	private String zipCode;
	private String address;
	
	private String title;
	@JoinColumn(name="apartmentTypeId")
	private ApartmentType apartmentType;
	private int size;
	
	private int bathroomsCount;
	
	private BigDecimal pricePerNight;
	private int minimumNights;
	
	private String description;
	private String rules;
}
