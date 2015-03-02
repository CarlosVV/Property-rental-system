package ee.rental.app.core.service.exception;

public class ApartmentNotFoundException extends RuntimeException{
	
	public ApartmentNotFoundException() {
		super();
	}
	public ApartmentNotFoundException(String message){
		super(message);
	}
	public ApartmentNotFoundException(String message, Throwable cause){
		super(message,cause);
	}
}
