/**
 * 
 */
var apartmentService = angular.module("ApartmentService", []);

apartmentService.factory("ApartmentService", [ "$resource",
		function($resource) {
			return {
				getApartment : function() {
					return $resource('/apartmentRental/getApartment/:id', {id : "@id"});
				},
				queryApartments : function() {
					return $resource("/apartmentRental/queryApartments");
				}
			}
		} ]);