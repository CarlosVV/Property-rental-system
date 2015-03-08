package ee.rental.app.core.service.exception;

public class ApartmentsNotFoundException extends RuntimeException{
	
	public ApartmentsNotFoundException() {
		super();
	}
	public ApartmentsNotFoundException(String message){
		super(message);
	}
	public ApartmentsNotFoundException(String message, Throwable cause){
		super(message,cause);
	}
}
