/**
 * 
 */
var apartmentController = angular.module("ApartmentController",[]);

apartmentController.controller("ShowApartmentCtrl", ["$scope","ApartmentService","$resource","$stateParams","uiGmapGoogleMapApi",function($scope,ApartmentService,$resource,$stateParams,uiGmapGoogleMapApi){
	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 7 };
	console.log("addapartmentctrl",$scope.map);
	
	$scope.service = ApartmentService;
	$scope.apartment={title:"y"};
	console.log($scope.apartment);
	console.log("ShowApartmentCtrl");
	console.log("n");
	$scope.changeLoc = function(){
		alert("s");
		$scope.marker.coords.latitude = 44.58193206287199;
        $scope.marker.coords.longitude = -72.263427734375;
        $scope.marker.options.draggable = false;
        $scope.map.center.latitude = 44.58193206287199;
        $scope.map.center.longitude = -72.263427734375;
	}
	ApartmentService.getApartment().get({apartmentId:1},function(apartment){
		$scope.apartment = apartment;
		console.log("hmm",$scope.apartment);
		$scope.marker = {
				id: 0,
			      coords: {
			        latitude: $scope.apartment.latitude,
			        longitude: $scope.apartment.longitude
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
			//$scope.marker.latitude = $scope.apartment.latitude;
			//$scope.marker.longitude = $scope.apartment.longitude;
			console.log("ok its loaded changing coord");
			//center map
			$scope.map.center.latitude = $scope.apartment.latitude;
			$scope.map.center.longitude = $scope.apartment.longitude;
			console.log($scope.marker.coords.latitude);
	        console.log($scope.marker.coords.longitude);
		//console.log("new lat:",$scope.marker.latitude);
	});
	
}]);
apartmentController.controller("AddApartmentCtrl",["$scope","ApartmentService","uiGmapGoogleMapApi",function($scope,ApartmentService,uiGmapGoogleMapApi){
	$scope.apartment = {};
	$scope.details={};
	console.log($scope.details);
	$scope.$watch('details',function(newVal){
		if(typeof newVal.geometry !== 'undefined'){
			$scope.marker.coords.latitude = newVal.geometry.location.k;
			$scope.marker.coords.longitude = newVal.geometry.location.D;
			$scope.map.center.latitude = newVal.geometry.location.k;
			$scope.map.center.longitude = newVal.geometry.location.D;
			$scope.map.zoom = 15;
			console.log($scope.details);
			console.log("house number",$scope.details.address_components[0].long_name);
			console.log("street",$scope.details.address_components[1].long_name);
			console.log("city",$scope.details.address_components[3].long_name);
			console.log("country",$scope.details.address_components[6].long_name);
			console.log("zipCode",$scope.details.address_components[7].long_name);
			$scope.apartment.country = $scope.details.address_components[6].long_name;
			$scope.apartment.city = $scope.details.address_components[3].long_name;
			$scope.apartment.zipCode = $scope.details.address_components[7].long_name;
			$scope.apartment.address = $scope.details.address_components[1].long_name+" "+$scope.details.address_components[0].long_name;
			console.log($scope.apartment.address);
			console.log("changed");
		}
	});
	$scope.autoCompleteOptions = {watchEnter:false};
	
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
		          $scope.apartment.longitude = lon;
		          $scope.apartment.latitude = lat;
		          console.log($scope.apartment.latitude);
		          console.log($scope.apartment.longitude);
		          console.log($scope.apartment);

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
apartmentController.controller("HomeController",["$scope","ApartmentService",function($scope,ApartmentService){
	$scope.neededAddressComponents = {
		locality : 'long_name',
		administrative_area_level_1: 'short_name',
		country: 'long_name'
	};
	$scope.query = {};
	$scope.details = {};
	$scope.autoCompleteOptions = {watchEnter:false};
	//get address details for query
	$scope.$watch('details',function(newVal){
		if(typeof newVal.address_components !== 'undefined'){
			//resetting query object for new location
			delete $scope.query.locality;
			delete $scope.query.administrative_area_level_1;
			delete $scope.query.country;
			for(var i=0; i < newVal.address_components.length; i++){
				var addressType = newVal.address_components[i].types[0];
				if($scope.neededAddressComponents[addressType]){
					$scope.query[addressType] = newVal.address_components[i][$scope.neededAddressComponents[addressType]];
				}
			}
		}
		console.log("query: ",$scope.query);
	});
	
	$scope.queryApartments = function(query){
		console.log("FORM SUBMIT:",$scope.query);
		ApartmentService.queryApartments().save($scope.query, function(){
			console.log("DATA SENT YAY");
		});
	}
	$scope.resetQuery = function(){
		delete $scope.query.locality;
		delete $scope.query.administrative_area_level_1;
		delete $scope.query.country;
	}
}]);