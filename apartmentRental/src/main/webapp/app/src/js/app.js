/**
 * 
 */

var rentalApp = angular.module('RentalApp',['ui.router','ngResource','uiGmapgoogle-maps','ApartmentService','ApartmentController']);

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

rentalApp.config(function(uiGmapGoogleMapApiProvider){
	uiGmapGoogleMapApiProvider.configure({
        v: '3.17',
        libraries: 'weather,geometry,visualization'
    });
	console.log("configured");
});