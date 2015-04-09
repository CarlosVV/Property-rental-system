package ee.rental.app.core.model.wrapper;

import java.math.BigDecimal;
import java.util.Date;





import ee.rental.app.core.model.Booking;
import ee.rental.app.core.model.BookingPayed;
import ee.rental.app.core.model.BookingStatus;
import ee.rental.app.core.model.UserAccount;

public class BookingWrapper {
	
	public BookingWrapper() {}
	public BookingWrapper(Booking b){
		this.bookingId = b.getId();
		this.propertyId = b.getProperty().getId();
		this.propertyTitle = b.getProperty().getTitle();
		this.country = b.getProperty().getCountry();
		this.city = b.getProperty().getCity();
		this.administrativeArea = b.getProperty().getAdministrativeArea();
		this.bookingStatus = b.getBookingStatus().getName();
		this.bookingStatusId = b.getBookingStatus().getId();
		this.userAccountId = b.getUserAccount().getId();
		this.userAccountUsername = b.getUserAccount().getUsername();
		this.checkIn = b.getCheckIn();
		this.checkOut = b.getCheckOut();
		this.guestNumber = b.getGuestNumber();
		this.price = b.getPrice();
		this.bookedDate = b.getBookedDate();
		this.propertyAccountUsername = b.getProperty().getUserAccount().getUsername();
	}
	@Override
	public String toString() {
		return "BookingWrapper [propertyId=" + propertyId + ", propertyTitle="
				+ propertyTitle + ", country=" + country + ", city=" + city
				+ ", administrativeArea=" + administrativeArea
				+ ", bookingStatus=" + bookingStatus + ", bookingStatusId="
				+ bookingStatusId + ", bookingPayed=" + bookingPayed
				+ ", checkIn=" + checkIn + ", checkOut=" + checkOut
				+ ", guestNumber=" + guestNumber + ", price=" + price
				+ ", userAccountId=" + userAccountId + ", userAccountUsername="
				+ userAccountUsername + "]";
	}
	private Long propertyId;
	private String propertyTitle;
	private String country;
	private String city;
	private String administrativeArea;
	private String bookingStatus;
	private Long bookingStatusId;
	private String bookingPayed;
	private Long bookingId;
	private Date checkIn;
	private Date checkOut;
	private Integer guestNumber;
	private BigDecimal price;
	private Long userAccountId;
	private String userAccountUsername;
	private Date bookedDate;
	private String propertyAccountUsername;
	
	public String getPropertyAccountUsername() {
		return propertyAccountUsername;
	}
	public void setPropertyAccountUsername(String propertyAccountUsername) {
		this.propertyAccountUsername = propertyAccountUsername;
	}
	public Date getBookedDate() {
		return bookedDate;
	}
	public void setBookedDate(Date bookedDate) {
		this.bookedDate = bookedDate;
	}
	public Long getBookingId() {
		return bookingId;
	}
	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
	}
	public Long getUserAccountId() {
		return userAccountId;
	}
	public void setUserAccountId(Long userAccountId) {
		this.userAccountId = userAccountId;
	}
	public String getUserAccountUsername() {
		return userAccountUsername;
	}
	public void setUserAccountUsername(String userAccountUsername) {
		this.userAccountUsername = userAccountUsername;
	}
	public Long getBookingStatusId() {
		return bookingStatusId;
	}
	public void setBookingStatusId(Long bookingStatusId) {
		this.bookingStatusId = bookingStatusId;
	}
	public Long getPropertyId() {
		return propertyId;
	}
	public void setPropertyId(Long propertyId) {
		this.propertyId = propertyId;
	}
	public String getPropertyTitle() {
		return propertyTitle;
	}
	public void setPropertyTitle(String propertyTitle) {
		this.propertyTitle = propertyTitle;
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
	public String getBookingStatus() {
		return bookingStatus;
	}
	public void setBookingStatus(String bookingStatus) {
		this.bookingStatus = bookingStatus;
	}
	public String getBookingPayed() {
		return bookingPayed;
	}
	public void setBookingPayed(String bookingPayed) {
		this.bookingPayed = bookingPayed;
	}
	public Date getCheckIn() {
		return checkIn;
	}
	public void setCheckIn(Date checkIn) {
		this.checkIn = checkIn;
	}
	public Date getCheckOut() {
		return checkOut;
	}
	public void setCheckOut(Date checkOut) {
		this.checkOut = checkOut;
	}
	public Integer getGuestNumber() {
		return guestNumber;
	}
	public void setGuestNumber(Integer guestNumber) {
		this.guestNumber = guestNumber;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
}
