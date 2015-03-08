/**
 * 
 */
var apartmentController = angular.module("ApartmentController",[]);

apartmentController.controller("ShowApartmentCtrl", ["$scope","ApartmentService","$resource","$stateParams",function($scope,ApartmentService,$resource,$stateParams){
	$scope.service = ApartmentService;
	$scope.apartment={title:"y"};
	console.log("ShowApartmentCtrl");
		console.log("n");
		ApartmentService.getApartment().get({apartmentId:1},function(apartment){
			$scope.apartment = apartment;
			console.log($scope.apartment);
		});
	
}]);
apartmentController.controller("AddApartmentCtrl",["$scope","ApartmentService","uiGmapGoogleMapApi",function($scope,ApartmentService,uiGmapGoogleMapApi){
	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
	console.log("addapartmentctrl",$scope.map);
	$scope.marker = {
			id: 0,
		      coords: {
		        latitude: 45,
		        longitude: -73
		      },
		      options: { draggable: true },
		      events: {
		        dragend: function (marker, eventName, args) {
		        	console.log('marker dragend');
		          var lat = marker.getPosition().lat();
		          var lon = marker.getPosition().lng();
		          console.log(lat);
		          console.log(lon);

		          $scope.marker.options = {
		            draggable: true,
		            labelContent: "lat: " + $scope.marker.coords.latitude + ' ' + 'lon: ' + $scope.marker.coords.longitude,
		            labelAnchor: "100 0",
		            labelClass: "marker-labels"
		          };
		        }
		      }
	};
	uiGmapGoogleMapApi.then(function(maps) {
		console.log("ok its loaded");
    });
}]);