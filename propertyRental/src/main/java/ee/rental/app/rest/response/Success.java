package ee.rental.app.rest.response;

public class Success {
	private String success;
	public Success(){}
	public Success(String success) {
		super();
		this.success = success;
	}

	public String getSuccess() {
		return success;
	}

	public void setSuccess(String success) {
		this.success = success;
	}
	
}
