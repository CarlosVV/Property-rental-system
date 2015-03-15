package ee.rental.app.core.repository;

import java.util.List;

import ee.rental.app.core.model.Apartment;
import ee.rental.app.core.model.wrapper.ApartmentQueryWrapper;

public interface ApartmentRepo {
	public Apartment createApartment(Apartment apartment);
	public List<Apartment> findAllApartments();
	public Apartment findApartment(Long id);
	public List<Apartment> findApartmentsByAccount(Long accountId);
	public Apartment updateApartment(Apartment data);
	public List<Apartment> queryApartmentsByCity(ApartmentQueryWrapper query);
	public List<Apartment> queryApartmentsByCountry(ApartmentQueryWrapper query);
}
