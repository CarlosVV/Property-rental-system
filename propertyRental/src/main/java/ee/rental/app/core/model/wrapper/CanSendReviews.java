package ee.rental.app.core.model.wrapper;

public class CanSendReviews {
	private boolean allowed;
	public CanSendReviews(){}
	public CanSendReviews(boolean allowed){
		this.allowed = allowed;
	}

	public boolean isAllowed() {
		return allowed;
	}

	public void setAllowed(boolean allowed) {
		this.allowed = allowed;
	}
	
}
