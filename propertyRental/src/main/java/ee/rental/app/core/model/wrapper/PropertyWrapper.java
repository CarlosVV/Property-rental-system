package ee.rental.app.core.model.wrapper;

public class PropertyWrapper {
	private String address;
	private String administrativeArea;
	private String bathroomCount;
	private String bedroomCount;
	private String city;
	private String country;
	private String description;
	private String latitude;
	private String longitude;
	private String minimumNights;
	private String postalCode;
	private String pricePerNight;
	private String propertyType;
	private String rules;
	private String size;
	private String title;
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getAdministrativeArea() {
		return administrativeArea;
	}
	public void setAdministrativeArea(String administrativeArea) {
		this.administrativeArea = administrativeArea;
	}
	public String getBathroomCount() {
		return bathroomCount;
	}
	public void setBathroomCount(String bathroomCount) {
		this.bathroomCount = bathroomCount;
	}
	public String getBedroomCount() {
		return bedroomCount;
	}
	public void setBedroomCount(String bedroomCount) {
		this.bedroomCount = bedroomCount;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getLatitude() {
		return latitude;
	}
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	public String getLongitude() {
		return longitude;
	}
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	public String getMinimumNights() {
		return minimumNights;
	}
	public void setMinimumNights(String minimumNights) {
		this.minimumNights = minimumNights;
	}
	public String getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}
	public String getPricePerNight() {
		return pricePerNight;
	}
	public void setPrice(String pricePerNight) {
		this.pricePerNight = pricePerNight;
	}
	public String getPropertyType() {
		return propertyType;
	}
	public void setPropertyType(String propertyType) {
		this.propertyType = propertyType;
	}
	public String getRules() {
		return rules;
	}
	public void setRules(String rules) {
		this.rules = rules;
	}
	public String getSize() {
		return size;
	}
	public void setSize(String size) {
		this.size = size;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	@Override
	public String toString() {
		return "PropertyWrapper [address=" + address + ", administrativeArea="
				+ administrativeArea + ", bathroomCount=" + bathroomCount
				+ ", bedroomCount=" + bedroomCount + ", city=" + city
				+ ", country=" + country + ", description=" + description
				+ ", latitude=" + latitude + ", longitude=" + longitude
				+ ", minimumNights=" + minimumNights + ", postalCode="
				+ postalCode + ", price=" + pricePerNight + ", propertyType="
				+ propertyType + ", rules=" + rules + ", size=" + size
				+ ", title=" + title + "]";
	}
	
}
