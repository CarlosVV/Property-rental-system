/**
 * 
 */
var propertyController = angular.module("PropertyController",[]);

propertyController.controller("ShowPropertyCtrl", ["$scope","PropertyService","$resource","$stateParams","uiGmapGoogleMapApi",function($scope,PropertyService,$resource,$stateParams,uiGmapGoogleMapApi){
	$scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 7 };
	console.log("addapartmentctrl",$scope.map);
	
	$scope.service = PropertyService;
	$scope.property={title:"y"};
	console.log($scope.property);
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
	PropertyService.property.get({id:1},function(property){
		$scope.property = property;
		console.log("hmm",$scope.property);
		$scope.marker = {
				id: 0,
			      coords: {
			        latitude: $scope.property.latitude,
			        longitude: $scope.property.longitude
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
			//$scope.marker.latitude = $scope.property.latitude;
			//$scope.marker.longitude = $scope.property.longitude;
			console.log("ok its loaded changing coord");
			//center map
			$scope.map.center.latitude = $scope.property.latitude;
			$scope.map.center.longitude = $scope.property.longitude;
			console.log($scope.marker.coords.latitude);
	        console.log($scope.marker.coords.longitude);
		//console.log("new lat:",$scope.marker.latitude);
	});
	
}]);
propertyController.controller("AddPropertyCtrl",["$scope","PropertyService","uiGmapGoogleMapApi",function($scope,PropertyService,uiGmapGoogleMapApi){
	$scope.property = {};
	$scope.details={};
	$scope.propertyTypes = PropertyService.propertyType.query();
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
			$scope.property.country = $scope.details.address_components[6].long_name;
			$scope.property.city = $scope.details.address_components[3].long_name;
			$scope.property.zipCode = $scope.details.address_components[7].long_name;
			$scope.property.address = $scope.details.address_components[1].long_name+" "+$scope.details.address_components[0].long_name;
			console.log($scope.property.address);
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
		          $scope.property.longitude = lon;
		          $scope.property.latitude = lat;
		          console.log($scope.property.latitude);
		          console.log($scope.property.longitude);
		          console.log($scope.property);

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
propertyController.controller("HomeController",["$scope","PropertyService","$state","$filter",function($scope,PropertyService,$state,$filter){
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
			$scope.query.locality = "";
			$scope.query.administrative_area_level_1 = "";
			$scope.query.country = "";
			for(var i=0; i < newVal.address_components.length; i++){
				var addressType = newVal.address_components[i].types[0];
				if($scope.neededAddressComponents[addressType]){
					$scope.query[addressType] = newVal.address_components[i][$scope.neededAddressComponents[addressType]];
				}
			}
		}
		console.log("query: ",$scope.query);
	});
	
	$scope.queryProperties = function(query){
		$state.go("queryProperties",{
			address:$scope.query.address,
			country:$scope.query.country,
			locality:$scope.query.locality,
			admArea:$scope.query.administrative_area_level_1,
			checkIn:moment($scope.query.checkIn).format('DD/MM/YYYY'),
			checkOut:moment($scope.query.checkOut).format('DD/MM/YYYY'),
			guestNumber:$scope.query.guestNumber
		});
	}
	$scope.resetQuery = function(){
		$scope.query.locality = "";
		$scope.query.administrative_area_level_1 = "";
		$scope.query.country = "";
	}
	//old way, should use directive instead!
	//moreover it is incorrect to use such method! cuz i am changing value of the variable but datepicker consumes moment object not string!
	//not sure how to show it in thesis.
	//i think i will just create directive for above $scope.$watch('details',f...
	/*$scope.$watch('data.dateDropDownInput',function(newVal){
		if(typeof $scope.data !== 'undefined'){
			$scope.data.dateDropDownInput = $filter("date")(newVal,'dd-MM-yyyy');
			console.log($scope.data.dateDropDownInput);
		}
	});*/
}]);
propertyController.controller("SearchPropertiesCtrl",["$scope", "PropertyService", "$stateParams", "$location", function($scope, PropertyService, $stateParams, $location){
	/*PropertyService.apartment.save($scope.query, function(){
	console.log("DATA SENT YAY");
	});*/
	$scope.neededAddressComponents = {
			locality : 'long_name',
			administrative_area_level_1: 'short_name',
			country: 'long_name'
	};
	$scope.query = {
			address:$stateParams.address,
			country:$stateParams.country,
			locality:$stateParams.locality,
			administrative_area_level_1:$stateParams.admArea,
			checkIn:$stateParams.checkIn,
			checkOut:$stateParams.checkOut,
			guestNumber:parseInt($stateParams.guestNumber)
	};
	$scope.details = {};
	$scope.autoCompleteOptions = {watchEnter:false};
	$scope.$watch('details',function(newVal){
		if(typeof newVal.address_components !== 'undefined'){
			//resetting query object for new location
			$scope.query.locality = "";
			$scope.query.administrative_area_level_1 = "";
			$scope.query.country = "";
			for(var i=0; i < newVal.address_components.length; i++){
				var addressType = newVal.address_components[i].types[0];
				if($scope.neededAddressComponents[addressType]){
					$scope.query[addressType] = newVal.address_components[i][$scope.neededAddressComponents[addressType]];
				}
			}
		}
		console.log("query: ",$scope.query);
	});
	$scope.properties = PropertyService.property.find($scope.query);
	$scope.queryProperties = function(query){
		var newUrl = "/queryProperties/"+$scope.query.address+"/"+$scope.query.country+"/"+$scope.query.locality+"/"+$scope.query.administrative_area_level_1+"/"+encodeURIComponent(moment($scope.query.checkIn).format('DD/MM/YYYY'))+"/"+encodeURIComponent(moment($scope.query.checkOut).format('DD/MM/YYYY'))+"/"+$scope.query.guestNumber;
		$location.path(newUrl).replace();
		$scope.properties = PropertyService.property.find($scope.query);
	}
	$scope.resetQuery = function(){
		$scope.query.locality = "";
		$scope.query.administrative_area_level_1 = "";
		$scope.query.country = "";
	}
	//:country/:city/:admArea/:checkIn/:checkOut
}]);