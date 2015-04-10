
INSERT INTO Authority(id,name,description) VALUES(1,'ROLE_USER','Every registered users have this role.');
INSERT INTO Authority(id,name,description) VALUES(2,'ROLE_ADMIN','Only admins have this role.');

INSERT INTO UserAccount(username,password,authority_id) VALUES('fuser','u',1);
INSERT INTO UserAccount(username,password,authority_id) VALUES('suser','s',1);

INSERT INTO PropertyType(id,name,description) VALUES(1,'Apartment','Apartment desc');
INSERT INTO PropertyType(id,name,description) VALUES(2,'Studio','Studio desc');
INSERT INTO PropertyType(id,name,description) VALUES(3,'House','House desc');

INSERT INTO PropertyFacility(id,name,description) VALUES(1,'Wifi','Wireless internet is provided');
INSERT INTO PropertyFacility(id,name,description) VALUES(2,'Kitchen','Guests can cook here');
INSERT INTO PropertyFacility(id,name,description) VALUES(3,'Heating','There is central heating or heater');
INSERT INTO PropertyFacility(id,name,description) VALUES(4,'Smoking allowed','Smoking is allowed in the property');
INSERT INTO PropertyFacility(id,name,description) VALUES(5,'Smoking not allowed','Smoking is banned in the property');
INSERT INTO PropertyFacility(id,name,description) VALUES(6,'Pets allowed','Pets are not allowed');
INSERT INTO PropertyFacility(id,name,description) VALUES(7,'Pets not allowed','Pets are not allowed');
INSERT INTO PropertyFacility(id,name,description) VALUES(8,'TV','TV is provided');
INSERT INTO PropertyFacility(id,name,description) VALUES(9,'Elevator','There is an elevator in the building');

INSERT INTO Property(userAccount_id,country,city,administrativeArea,postalCode,address,title,propertyType_id,size,bathroomCount,bedroomCount,pricePerNight,minimumNights,description,rules,longitude,latitude,guestCount,bedCount,createdDate) VALUES(1,'Estonia','Tallinn','Harju maakond','13618','Liikuri 40','Pretty large apartment',1,50,3,2,505,2,'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.','no smoking plix plox',24.820325499999967,59.4410596,3,2,'2013-01-05');
INSERT INTO Property(userAccount_id,country,city,administrativeArea,postalCode,address,title,propertyType_id,size,bathroomCount,bedroomCount,pricePerNight,minimumNights,description,rules,longitude,latitude,guestCount,bedCount,createdDate) VALUES(1,'Estonia','Tallinn','Harju maakond','11912','Rebasesaba tee 10','Magnificent beach house',3,50,3,1,505,2,'first apartment desc','no smoking plix plox',24.847988299999997,59.47842519999999,3,2,'2012-02-01');

INSERT INTO ImagePath(property_id,path) VALUES(1,'eaton0506_468x311.jpg');
INSERT INTO ImagePath(property_id,path) VALUES(1,'FLAT_5.jpg');
INSERT INTO ImagePath(property_id,path) VALUES(1,'retro-minimalist-dining-room-flat-design.jpg');
INSERT INTO ImagePath(property_id,path) VALUES(2,'parthenon-queen-elizabeth-flat-ipanema.jpg');
INSERT INTO ImagePath(property_id,path) VALUES(2,'Small_flat_002_by_Geckly.jpg');
INSERT INTO ImagePath(property_id,path) VALUES(2,'pleasant-modern-flat-in-a-new-building-a34db005af5b5b9e8d6b506c7a7c38e6.jpg');

INSERT INTO Property_PropertyFacility(property_id,propertyFacilities_id) VALUES(1,2);
INSERT INTO Property_PropertyFacility(property_id,propertyFacilities_id) VALUES(1,4);
INSERT INTO Property_PropertyFacility(property_id,propertyFacilities_id) VALUES(1,6);
INSERT INTO Property_PropertyFacility(property_id,propertyFacilities_id) VALUES(2,1);
INSERT INTO Property_PropertyFacility(property_id,propertyFacilities_id) VALUES(2,3);
INSERT INTO Property_PropertyFacility(property_id,propertyFacilities_id) VALUES(2,5);

INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-04-20');
INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-04-21');

INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-05-12');
INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-05-13');
INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-05-14');
INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-05-15');

INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-04-05');
INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-04-06');

INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-04-03');
INSERT INTO UnavailableDate(property_id,when) VALUES(1,'2015-04-04');

INSERT INTO BookingStatus(id,name,description) VALUES(1,'Created','The booking has been created');
INSERT INTO BookingStatus(id,name,description) VALUES(2,'Payed and accepted','The booking had been payed by the customer and owner accepted it');
INSERT INTO BookingStatus(id,name,description) VALUES(3,'Cancelled by owner','The booking has been cancelled by the owner');

INSERT INTO Booking(userAccount_id, property_id, bookingStatus_id, checkIn, checkOut,price,guestNumber,bookedDate) VALUES(2,1,2,'2014-04-01','2014-04-12',1400,2,'2014-03-02');
INSERT INTO Booking(userAccount_id, property_id, bookingStatus_id, checkIn, checkOut,price,guestNumber,bookedDate) VALUES(2,1,2,'2014-08-06','2014-08-15',1400,2,'2014-06-22');
INSERT INTO Booking(userAccount_id, property_id, bookingStatus_id, checkIn, checkOut,price,guestNumber,bookedDate) VALUES(2,1,2,'2015-05-01','2015-05-10',1000,2,'2015-04-01');
INSERT INTO Booking(userAccount_id, property_id, bookingStatus_id, checkIn, checkOut,price,guestNumber,bookedDate) VALUES(2,2,2,'2015-06-02','2015-06-10',1300,2,'2015-05-09');
INSERT INTO Booking(userAccount_id, property_id, bookingStatus_id, checkIn, checkOut,price,guestNumber,bookedDate) VALUES(2,1,2,'2015-07-01','2015-07-12',1400,2,'2015-06-11');

INSERT INTO Review(author_id,property_id,review,stars,addingDate) VALUES(2,1,'VERY NICE PROPERTY 10/10',5,'2015-04-06');
INSERT INTO Review(author_id,property_id,review,stars,addingDate) VALUES(2,1,'Didnt like it',2,'2015-05-12');
INSERT INTO Review(author_id,property_id,review,parentReview_id,addingDate) VALUES(1,1,'Thank you for good review!',1,'2015-05-16');

INSERT INTO Message(sentDate,message,sender_id,receiver_id,booking_id,receiverRead) VALUES('2011-03-15','Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',1,2,1,false);
INSERT INTO Message(sentDate,message,sender_id,receiver_id,booking_id,receiverRead) VALUES('2011-03-15','Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',2,1,2,false);