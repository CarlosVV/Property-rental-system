/**
 * 
 */

var rentalApp = angular.module('RentalApp',['ui.router','ngResource','ApartmentService','ApartmentController']);

rentalApp.config(
	function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise("/home");
		$stateProvider
			.state("home", {
				url:"/home",
				views: {
					"mainView":{
						templateUrl:"partials/home.html"
					}
				}
			})
			.state("apartmentListByQuery", {
				url:"/apartmentListByQuery",
				views: {
					"mainView":{
						templateUrl:"partials/apartmentListByQuery.html"
					}
				}
			})
			.state("showApartment",{
				url:"/showApartment/{apartmentId}",
				views:{
					"mainView":{
						templateUrl:"partials/showApartment.html",
						controller:"ApartmentCtrl"
					}
				}
			});
	}
);