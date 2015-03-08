package ee.rental.app.core.service;

import java.util.List;

import ee.rental.app.core.model.Apartment;

public interface ApartmentService {
	public Apartment createApartment(Apartment apartment);
	public List<Apartment> findAllApartments();
	public Apartment findApartment(Long id);
	public List<Apartment> findApartmentsByAccount(Long accountId);
	public List<Apartment> queryApartments();
}
