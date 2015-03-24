/**
 * 
 */

var rentalApp = angular.module('RentalApp',['ui.router','ngResource','uiGmapgoogle-maps','ngAutocomplete','ui.bootstrap.datetimepicker','ApartmentService','ApartmentController','ApartmentDirective']);

rentalApp.constant('API_URL',"/apartmentRental/");

rentalApp.config(
	function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state("home", {
				url:"/",
				views: {
					"mainView":{
						templateUrl:"partials/home.html",
						controller:"HomeController"
					}
				}
			})
			.state("queryApartments",{
				url:"/queryApartments/:address/:country/:locality/:admArea/:checkIn/:checkOut/:guestNumber",
				views: {
					"mainView":{
						templateUrl:"partials/apartmentListByQuery.html",
						controller:"SearchApartments"
					}
				}
			})
			.state("showApartment",{
				url:"/showApartment/{apartmentId}",
				views:{
					"mainView":{
						templateUrl:"partials/showApartment.html",
						controller:"ShowApartmentCtrl"
					}
				}
			})
			.state("addApartment",{
				url:"/addApartment",
				views:{
					"mainView":{
						templateUrl:"partials/addApartment.html",
						controller:"AddApartmentCtrl"
					}
				}
			});
	}
);
/*
if use this way of injecting google maps api then ngAutocomplete doesn't work.
Just inject with <script> and nothing changes in the rest of app but it is not recomended to do like that
rentalApp.config(function(uiGmapGoogleMapApiProvider){
	uiGmapGoogleMapApiProvider.configure({
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
	console.log("configured");
});*/