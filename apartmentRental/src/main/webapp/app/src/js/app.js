/**
 * 
 */

var rentalApp = angular.module('RentalApp',['ui.router','ngResource','uiGmapgoogle-maps','ngAutocomplete','ApartmentService','ApartmentController']);

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