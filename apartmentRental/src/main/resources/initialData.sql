INSERT INTO UserAccount(username) VALUES('FIRST USER');
INSERT INTO UserAccount(username) VALUES('SECOND USER');

INSERT INTO ApartmentType(id,name,description) VALUES(1,'Studio','Studio desc');

INSERT INTO Apartment(owner_id,country,city,zipCode,address,title,apartmentType_id,size,bathroomsCount,pricePerNight,minimumNights,description,rules) VALUES(1,'country1','city1','zipcode1','adress 1 2','first apartment',1,50,3,505,2,'first apartment desc','no smoking plix plox');

INSERT INTO BookingStatus(id,name,description) VALUES(1,'Created','The booking is created');

INSERT INTO Booking(account_id, apartment_id, bookingStatus_id) VALUES(2,1,1);

INSERT INTO Guest(firstName,surname,booking_id) VALUES('petr','petrov',1);
INSERT INTO Guest(firstName,surname,booking_id) VALUES('ivan','ivanov',1);

INSERT INTO Message(message,sender_id,receiver_id,booking_id) VALUES('dgsaigs',1,2,1);