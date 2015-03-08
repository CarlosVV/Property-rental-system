/**
 * 
 */
var apartmentController = angular.module("ApartmentController",[]);

apartmentController.controller("ApartmentCtrl", ["$scope","ApartmentService","$resource","$stateParams",function($scope,ApartmentService,$resource,$stateParams){
	$scope.service = ApartmentService;
	$scope.apartment={title:"y"};
	console.log("ApartmentCtrl");
		console.log("n");
		ApartmentService.getApartment().get({apartmentId:1},function(apartment){
			$scope.apartment = apartment;
			console.log($scope.apartment);
		});
	
}]);