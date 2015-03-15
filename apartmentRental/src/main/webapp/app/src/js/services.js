/**
 * 
 */
var apartmentService = angular.module("ApartmentService",[]);

apartmentService.factory("ApartmentService", ["$resource", function($resource){
	return $resource('/apartmentRental/getApartment/:id',{id:"@id"});
}]);