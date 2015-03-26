package ee.rental.app.core.model.wrapper;

import java.util.Date;

public class PropertyQueryWrapper {
	private String address;
	private String country;
	private String city;
	private String administrativeArea;
	private String checkIn;
	private String checkOut;
	private int guestNumber;
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
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
	public String getAdministrativeArea() {
		return administrativeArea;
	}
	public void setAdministrativeArea(String administrativeArea) {
		this.administrativeArea = administrativeArea;
	}
	public String getCheckIn() {
		return checkIn;
	}
	public void setCheckIn(String checkIn) {
		this.checkIn = checkIn;
	}
	public String getCheckOut() {
		return checkOut;
	}
	public void setCheckOut(String checkOut) {
		this.checkOut = checkOut;
	}
	public int getGuestNumber() {
		return guestNumber;
	}
	public void setGuestNumber(int guestNumber) {
		this.guestNumber = guestNumber;
	}
	@Override
	public String toString() {
		return "ApartmentQueryWrapper [address=" + address + ", country="
				+ country + ", locality=" + city
				+ ", administrative_area_level_1="
				+ administrativeArea + ", checkIn=" + checkIn
				+ ", checkOut=" + checkOut + ", guestNumber=" + guestNumber
				+ "]";
	}
	
}
