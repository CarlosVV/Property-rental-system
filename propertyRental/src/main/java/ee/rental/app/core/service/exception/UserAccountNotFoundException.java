package ee.rental.app.core.service.exception;

public class UserAccountNotFoundException extends RuntimeException{

	public UserAccountNotFoundException() {
		super();
	}

	public UserAccountNotFoundException(String message, Throwable cause) {
		super(message, cause);
	}

	public UserAccountNotFoundException(String message) {
		super(message);
	}

}
