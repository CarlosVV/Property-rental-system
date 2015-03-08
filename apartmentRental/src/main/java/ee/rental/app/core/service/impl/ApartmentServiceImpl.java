package ee.rental.app.core.service.impl;

import java.util.List;

import javax.persistence.Embeddable;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ee.rental.app.core.model.Apartment;
import ee.rental.app.core.model.UserAccount;
import ee.rental.app.core.repository.ApartmentRepo;
import ee.rental.app.core.repository.UserAccountRepo;
import ee.rental.app.core.service.ApartmentService;
import ee.rental.app.core.service.exception.UserAccountNotFoundException;

@Service
@Transactional
public class ApartmentServiceImpl implements ApartmentService{
	@Autowired
	private ApartmentRepo apartmentRepo;
	@Autowired
	private UserAccountRepo userAccountRepo;
	public Apartment createApartment(Apartment apartment) {
		UserAccount account = userAccountRepo.findUserAccount(apartment.getOwner().getId());
		if(account == null)
			throw new UserAccountNotFoundException();
		return apartmentRepo.createApartment(apartment);
	}

	@Override
	public List<Apartment> findAllApartments() {
		return apartmentRepo.findAllApartments();
	}

	@Override
	public Apartment findApartment(Long id) {
		return apartmentRepo.findApartment(id);
	}

	@Override
	public List<Apartment> findApartmentsByAccount(Long accountId) {
		return apartmentRepo.findApartmentsByAccount(accountId);
	}

	@Override
	public List<Apartment> queryApartments() {
		// TODO Auto-generated method stub
		return null;
	}

}
