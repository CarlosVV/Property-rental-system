package ee.rental.app.core.model.wrapper;

import java.util.Date;
import java.util.List;

import ee.rental.app.core.model.Property;
import ee.rental.app.core.model.UnavailableDate;

public class PropertyWrapper {
	private Long id;
	private String address;
	private String administrativeArea;
	private String city;
	private String country;
	private String postalCode;
	private String title;
	private Date createdDate;
	private List<UnavailableDate> bookedDays;
	private List<UnavailableDate> unavailableDates;
	public PropertyWrapper(){}
	public PropertyWrapper(Property p){
		this.id = p.getId();
		this.address = p.getAddress();
		this.administrativeArea = p.getAdministrativeArea();
		this.city = p.getCity();
		this.country = p.getCountry();
		this.postalCode = p.getPostalCode();
		this.title = p.getTitle();
		this.createdDate = p.getCreatedDate();
	}
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
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
	public String getPostalCode() {
		return postalCode;
	}
	public void setPostalCode(String postalCode) {
		this.postalCode = postalCode;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public List<UnavailableDate> getBookedDays() {
		return bookedDays;
	}
	public void setBookedDays(List<UnavailableDate> bookedDays) {
		this.bookedDays = bookedDays;
	}
	public List<UnavailableDate> getUnavailableDates() {
		return unavailableDates;
	}
	public void setUnavailableDates(List<UnavailableDate> unavailableDates) {
		this.unavailableDates = unavailableDates;
	}
	
}
