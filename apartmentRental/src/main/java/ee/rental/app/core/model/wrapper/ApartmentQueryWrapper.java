package ee.rental.app.core.model.wrapper;

import java.util.Date;

public class ApartmentQueryWrapper {
	private String address;
	private String country;
	private String locality;
	private String administrative_area_level_1;
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
	public String getLocality() {
		return locality;
	}
	public void setLocality(String locality) {
		this.locality = locality;
	}
	public String getAdministrative_area_level_1() {
		return administrative_area_level_1;
	}
	public void setAdministrative_area_level_1(String administrative_area_level_1) {
		this.administrative_area_level_1 = administrative_area_level_1;
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
				+ country + ", locality=" + locality
				+ ", administrative_area_level_1="
				+ administrative_area_level_1 + ", checkIn=" + checkIn
				+ ", checkOut=" + checkOut + ", guestNumber=" + guestNumber
				+ "]";
	}
	
}
