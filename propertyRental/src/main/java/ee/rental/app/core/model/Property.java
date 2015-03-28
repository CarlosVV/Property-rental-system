package ee.rental.app.core.model;

import java.math.BigDecimal;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class,property="@propertyId")
public class Property {
	@Id @GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	@Override
	public String toString() {
		return "Property [id=" + id + ", owner=" + owner + ", country="
				+ country + ", city=" + city + ", administrativeArea="
				+ administrativeArea + ", postalCode=" + postalCode
				+ ", address=" + address + ", longitude=" + longitude
				+ ", latitude=" + latitude + ", title=" + title
				+ ", propertyType=" + propertyType + ", size=" + size
				+ ", bathroomCount=" + bathroomCount + ", bedroomCount="
				+ bedroomCount + ", pricePerNight=" + pricePerNight
				+ ", minimumNights=" + minimumNights + ", description="
				+ description + ", rules=" + rules + ", reviews=" + reviews
				+ ", propertyFacilities=" + propertyFacilities
				+ ", imagePaths=" + imagePaths + "]";
	}
	//@JoinColumn(name="ownerId")
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	private UserAccount owner;
	private String country;
	private String city;
	private String administrativeArea;
	private String postalCode;
	private String address;
	private Double longitude;
	private Double latitude;
	
	
	private String title;
	//@JoinColumn(name="apartmentTypeId")
	@OneToOne
	//@PrimaryKeyJoinColumn
	private PropertyType propertyType;
	private int size;

	private int bathroomCount;
	private int bedroomCount;
	private int bedCount;
	private int guestCount;
	
	private BigDecimal pricePerNight;
	private int minimumNights;
	@Lob
	private String description;
	@Lob
	private String rules;
	
	//@OneToMany(mappedBy="property")
	//private List<UnavailableDate> unavailableDates;
	@OneToMany(mappedBy="property")
	private List<Review> reviews;
	@ManyToMany
	private List<PropertyFacility> propertyFacilities;
	@OneToMany(mappedBy="property")
	private List<ImagePath> imagePaths;
	
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public int getBedCount() {
		return bedCount;
	}
	public void setBedCount(int bedCount) {
		this.bedCount = bedCount;
	}
	public int getGuestCount() {
		return guestCount;
	}
	public void setGuestCount(int guestCount) {
		this.guestCount = guestCount;
	}
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
	public String getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
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
	public PropertyType getPropertyType() {
		return propertyType;
	}
	public void setPropertyType(PropertyType propertyType) {
		this.propertyType = propertyType;
	}
	public int getSize() {
		return size;
	}
	public void setSize(int size) {
		this.size = size;
	}
	public int getBathroomCount() {
		return bathroomCount;
	}
	public void setBathroomCount(int bathroomCount) {
		this.bathroomCount = bathroomCount;
	}
	public int getBedroomCount() {
		return bedroomCount;
	}
	public void setBedroomCount(int bedroomCount) {
		this.bedroomCount = bedroomCount;
	}
	public List<ImagePath> getImagePaths() {
		return imagePaths;
	}
	public void setImagePaths(List<ImagePath> imagePaths) {
		this.imagePaths = imagePaths;
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
	public List<Review> getReviews() {
		return reviews;
	}
	public void setReviews(List<Review> reviews) {
		this.reviews = reviews;
	}
	public List<PropertyFacility> getPropertyFacilities() {
		return propertyFacilities;
	}
	public void setPropertyFacilities(List<PropertyFacility> propertyFacilities) {
		this.propertyFacilities = propertyFacilities;
	}
	public String getAdministrativeArea() {
		return administrativeArea;
	}
	public void setAdministrativeArea(String administrativeArea) {
		this.administrativeArea = administrativeArea;
	}
	
	
}
