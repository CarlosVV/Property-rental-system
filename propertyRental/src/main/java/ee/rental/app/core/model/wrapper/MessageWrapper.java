package ee.rental.app.core.model.wrapper;

import java.util.Date;

import ee.rental.app.core.model.Message;

public class MessageWrapper {
	private String message;
	private String senderUsername;
	private String receiverUsername;
	private Long bookingId;
	private Date sentDate;
	private Boolean receiverRead;
	public MessageWrapper(){}
	public MessageWrapper(Message m){
		this.message = m.getMessage();
		this.senderUsername = m.getSender().getUsername();
		this.receiverUsername = m.getReceiver().getUsername();
		this.bookingId = m.getBooking().getId();
		this.sentDate = m.getSentDate();
		this.receiverRead = m.getReceiverRead();
	}
	public Boolean getReceiverRead() {
		return receiverRead;
	}
	public void setReceiverRead(Boolean receiverRead) {
		this.receiverRead = receiverRead;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getSenderUsername() {
		return senderUsername;
	}
	public void setSenderUsername(String senderUsername) {
		this.senderUsername = senderUsername;
	}
	public String getReceiverUsername() {
		return receiverUsername;
	}
	public void setReceiverUsername(String receiverUsername) {
		this.receiverUsername = receiverUsername;
	}
	public Long getBookingId() {
		return bookingId;
	}
	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
	}
	public Date getSentDate() {
		return sentDate;
	}
	public void setSentDate(Date sentDate) {
		this.sentDate = sentDate;
	}
	@Override
	public String toString() {
		return "MessageWrapper [message=" + message + ", senderUsername="
				+ senderUsername + ", receiverUsername=" + receiverUsername
				+ ", bookingId=" + bookingId + ", sentDate=" + sentDate
				+ ", receiverRead=" + receiverRead + "]";
	}
}
