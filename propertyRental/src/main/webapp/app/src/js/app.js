/**
 * 
 */

var rentalApp = angular.module('RentalApp',['ui.router','ngResource','uiGmapgoogle-maps','ngAutocomplete','ui.bootstrap.datetimepicker','angularFileUpload','PropertyService','PropertyController','PropertyDirective']);

rentalApp.constant('API_URL',"/propertyRental/");

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
			.state("queryProperties",{
				url:"/queryProperties/:address/:country/:city/:admArea/:checkIn/:checkOut/:guestNumber",
				views: {
					"mainView":{
						templateUrl:"partials/propertyListByQuery.html",
						controller:"SearchPropertiesCtrl"
					}
				}
			})
			.state("showProperty",{
				url:"/showProperty/{propertyId}",
				views:{
					"mainView":{
						templateUrl:"partials/showProperty.html",
						controller:"ShowPropertyCtrl"
					}
				}
			})
			.state("addProperty",{
				url:"/addProperty",
				views:{
					"mainView":{
						templateUrl:"partials/addProperty.html",
						controller:"AddPropertyCtrl"
					}
				}
			})
			.state("updateProperty",{
				url:"/updateProperty/{propertyId}",
				views:{
					"mainView":{
						templateUrl:"partials/updateProperty.html",
						controller:"UpdatePropertyCtrl"
					}
				}
			})
			.state("showMyProperties",{
				url:"/showMyProperties",
				views:{
					"mainView":{
						templateUrl:"partials/showMyProperties.html",
						controller:"ShowMyPropertiesCtrl"
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