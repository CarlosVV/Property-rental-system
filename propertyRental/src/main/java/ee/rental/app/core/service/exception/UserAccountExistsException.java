package ee.rental.app.core.service.exception;

import ee.rental.app.core.model.UserAccount;

public class UserAccountExistsException extends RuntimeException{

	public UserAccountExistsException() {
		super();
	}

	public UserAccountExistsException(String message, Throwable cause) {
		super(message, cause);
	}

	public UserAccountExistsException(String message) {
		super(message);
	}

}
