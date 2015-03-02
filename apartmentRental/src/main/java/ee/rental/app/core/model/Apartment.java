package ee.rental.app.core.model;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

@Entity
public class Apartment {
	@Id @GeneratedValue
	private Long id;
	//@JoinColumn(name="ownerId")
	@OneToOne(cascade=CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private UserAccount owner;
	private String country;
	private String city;
	private String zipCode;
	private String address;
	
	private String title;
	//@JoinColumn(name="apartmentTypeId")
	@OneToOne(cascade=CascadeType.ALL)
	@PrimaryKeyJoinColumn
	private ApartmentType apartmentType;
	private int size;
	
	private int bathroomsCount;
	
	private BigDecimal pricePerNight;
	private int minimumNights;
	
	private String description;
	private String rules;
	
	@OneToMany
	private List<InavailabilityDate> inavailabilityDates;
	@OneToMany
	private List<Review> reviews;
	@OneToMany
	private List<ApartmentFacility> apartmentFacilities;
	
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public UserAccount getOwner() {
		return owner;
	}
	public void setOwner(UserAccount owner) {
		this.owner = owner;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getZipCode() {
		return zipCode;
	}
	public void setZipCode(String zipCode) {
		this.zipCode = zipCode;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public ApartmentType getApartmentType() {
		return apartmentType;
	}
	public void setApartmentType(ApartmentType apartmentType) {
		this.apartmentType = apartmentType;
	}
	public int getSize() {
		return size;
	}
	public void setSize(int size) {
		this.size = size;
	}
	public int getBathroomsCount() {
		return bathroomsCount;
	}
	public void setBathroomsCount(int bathroomsCount) {
		this.bathroomsCount = bathroomsCount;
	}
	public BigDecimal getPricePerNight() {
		return pricePerNight;
	}
	public void setPricePerNight(BigDecimal pricePerNight) {
		this.pricePerNight = pricePerNight;
	}
	public int getMinimumNights() {
		return minimumNights;
	}
	public void setMinimumNights(int minimumNights) {
		this.minimumNights = minimumNights;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getRules() {
		return rules;
	}
	public void setRules(String rules) {
		this.rules = rules;
	}
	public List<InavailabilityDate> getInavailabilityDates() {
		return inavailabilityDates;
	}
	public void setInavailabilityDates(List<InavailabilityDate> inavailabilityDates) {
		this.inavailabilityDates = inavailabilityDates;
	}
	public List<Review> getReviews() {
		return reviews;
	}
	public void setReviews(List<Review> reviews) {
		this.reviews = reviews;
	}
	public List<ApartmentFacility> getApartmentFacilities() {
		return apartmentFacilities;
	}
	public void setApartmentFacilities(List<ApartmentFacility> apartmentFacilities) {
		this.apartmentFacilities = apartmentFacilities;
	}
	
	
}
