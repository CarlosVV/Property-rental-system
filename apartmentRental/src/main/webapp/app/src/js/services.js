/**
 * 
 */
var apartmentService = angular.module("ApartmentService",[]);

apartmentService.service("ApartmentService", ["$http", "$rootScope", "$state","$resource", function($http,$rootScope,$state,$resource){
	var that = this;
	this.apartmentList = [];
	this.getApartment = function(apartmentId){
		console.log("yay service");
		return $resource('/apartmentRental/getApartment/:id',{},{
			query:{method:"GET",params:{id:apartmentId},isArray:true}
		});
	}
}]);