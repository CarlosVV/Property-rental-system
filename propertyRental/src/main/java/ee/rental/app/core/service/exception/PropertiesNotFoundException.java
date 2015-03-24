package ee.rental.app.core.service.exception;

public class PropertiesNotFoundException extends RuntimeException{
	
	public PropertiesNotFoundException() {
		super();
	}
	public PropertiesNotFoundException(String message){
		super(message);
	}
	public PropertiesNotFoundException(String message, Throwable cause){
		super(message,cause);
	}
}
