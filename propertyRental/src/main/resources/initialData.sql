INSERT INTO UserAccount(username) VALUES('FIRST USER');
INSERT INTO UserAccount(username) VALUES('SECOND USER');

INSERT INTO PropertyType(id,name,description) VALUES(1,'Apartment','Apartment desc');
INSERT INTO PropertyType(id,name,description) VALUES(2,'Studio','Studio desc');
INSERT INTO PropertyType(id,name,description) VALUES(3,'House','House desc');

INSERT INTO Property(owner_id,country,city,administrativeArea,postalCode,address,title,propertyType_id,size,bathroomCount,bedroomCount,pricePerNight,minimumNights,description,rules,longitude,latitude) VALUES(1,'Estonia','Tallinn','Harju County','zipcode1','adress 1 2','first apartment',1,50,3,2,505,2,'first apartment desc','no smoking plix plox',-71,44);
INSERT INTO Property(owner_id,country,city,administrativeArea,postalCode,address,title,propertyType_id,size,bathroomCount,bedroomCount,pricePerNight,minimumNights,description,rules,longitude,latitude) VALUES(1,'Estonia','Tartu','Tartu County','zipcode2','adress 3 4','2nd apartment',1,50,3,1,505,2,'first apartment desc','no smoking plix plox',-71,44);

INSERT INTO BookingStatus(id,name,description) VALUES(1,'Created','The booking is created');

INSERT INTO Booking(account_id, property_id, bookingStatus_id) VALUES(2,1,1);

INSERT INTO Guest(firstName,surname,booking_id) VALUES('petr','petrov',1);
INSERT INTO Guest(firstName,surname,booking_id) VALUES('ivan','ivanov',1);

INSERT INTO Message(sentDate,message,sender_id,receiver_id,booking_id) VALUES('2011-03-15 00:22:22','dgsaigs',1,2,1);