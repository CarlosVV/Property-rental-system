/**
 * Add property module.
 */
var addProperty = angular.module("addProperty",[]);
addProperty.config(["$stateProvider",function($stateProvider){
	/**
	 * State configuration.
	 */
	$stateProvider.state("addProperty",{
		url:"/addProperty",
		views:{
			"mainView":{
				templateUrl:"modules/addProperty/partials/addProperty.html",
				controller:"AddPropertyCtrl"
			}
		},
        data : {
            	authorities:['ROLE_USER'],
            	pageTitle:"Add property"
        }
	});
}]);
addProperty.controller("AddPropertyCtrl",["$scope","$timeout","$state","PropertyService","$upload","API_URL",function($scope,$timeout,$state,PropertyService,$upload,API_URL){
	$scope.property = new PropertyService.property;
	$scope.property.userAccount = {username:localStorage.currentUsername};
	$scope.property.imagePaths = [];
	$scope.property.propertyFacilities = [];
	$scope.details= {};
	$scope.propertyTypes = PropertyService.propertyTypes.query();
	$scope.propertyFacilities = PropertyService.propertyFacilities.query();
	$scope.photosToUpload = [];
	$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
	
	$scope.steps = [
	                "Main details",
	                "Sizing",
	                "Description",
	                "Photos"
	                ];
	$scope.currentStep = 0;
	$scope.hasNextStep = true;
	$scope.hasPreviousStep = false;
	$scope.nextStep = function() {
		$scope.goToStep($scope.currentStep+1);
	};
	$scope.previousStep = function() {
		$scope.goToStep($scope.currentStep-1);
	};
	$scope.goToStep = function(index) {
	    if(typeof $scope.steps[index] !== 'undefined'){
		    $scope.currentStep = index;
			$scope.hasNextStep = $scope.checkNextStep();
			$scope.hasPreviousStep = $scope.checkPreviousStep();
	    }
	};
	$scope.checkNextStep = function(){
		if(typeof $scope.steps[$scope.currentStep+1] !== 'undefined'){
			return true;
		}
		return false;
	};
	$scope.checkPreviousStep = function(){
		if(typeof $scope.steps[$scope.currentStep-1] !== 'undefined'){
			return true;
		}
		return false;
	};
	
	

	$scope.$watch('marker',function(){
		if(!angular.isUndefined($scope.marker)){
			$scope.property.latitude = $scope.marker.coords.latitude;
			$scope.property.longitude = $scope.marker.coords.longitude;
		}
	},true);
	
	
	$scope.neededAddressComponents = {
			locality : 'long_name',
			administrative_area_level_1: 'short_name',
			country: 'long_name',
			postal_code:'long_name',
			route:'long_name',
			street_number:'long_name'
	};
	$scope.addressAssembler = {
		locality:'city',
		administrative_area_level_1:'administrativeArea',
		country:'country',
		postal_code:'postalCode'
	};
	$scope.addressComponentsAssembler = {
		route:'street',
		street_number:'street_number'
	};
	$scope.resetQuery = function(){
		$scope.property.city = "";
		$scope.property.administrativeArea = "";
		$scope.property.country = "";
		$scope.property.postalCode = "";
		$scope.streetNumber = "";
	};
	$scope.$watch('address',function(newVal){
		if(typeof $scope.address !== 'undefined'){
			if($scope.address == ""){
				$scope.address = $scope.addressBackup;
			}else{
				$scope.addressBackup = $scope.address;
			}
		}else{
			$scope.address = $scope.addressBackup;
		}
	});
	$scope.resetQuery = function(){
		$scope.streetNumber = "";
	};
	//get address details for property
	$scope.$watch('details',function(newVal){
		if(typeof newVal.address_components !== 'undefined'){
			var street = "";
			var streetNumber = "";
			for(var i=0; i < newVal.address_components.length; i++){
				var addressType = newVal.address_components[i].types[0];
				if($scope.neededAddressComponents[addressType]){
					if($scope.addressComponentsAssembler[addressType] == 'street'){
						street = newVal.address_components[i][$scope.neededAddressComponents[addressType]];
					}else if($scope.addressComponentsAssembler[addressType] == 'street_number'){
						streetNumber = " "+newVal.address_components[i][$scope.neededAddressComponents[addressType]];
					}else{
						$scope.property[$scope.addressAssembler[addressType]] = newVal.address_components[i][$scope.neededAddressComponents[addressType]];
					}
				}
			}
			$scope.streetNumber = streetNumber;
			$scope.property.address = street+streetNumber;
			
			$scope.marker.coords.latitude = newVal.geometry.location.A;
			$scope.marker.coords.longitude = newVal.geometry.location.F;
			$scope.map.center.latitude = newVal.geometry.location.A;
			$scope.map.center.longitude = newVal.geometry.location.F;
			$scope.map.zoom = 16;
			$scope.property.latitude = newVal.geometry.location.A;
			$scope.property.longitude = newVal.geometry.location.F;
		}
	});
	$scope.autoCompleteOptions = {watchEnter:false};
	$scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 8 };
	$scope.marker = {
			id: 0,
		      coords: {
		        latitude: 45,
		        longitude: -73
		      },
		      options: { draggable: true },
		      events: {
		        dragend: function (marker, eventName, args) {
		          var lat = marker.getPosition().lat();
		          var lon = marker.getPosition().lng();
		          $scope.property.longitude = lon;
		          $scope.property.latitude = lat;
		          $scope.marker.options = {
		            draggable: true,
		            labelAnchor: "100 0",
		            labelClass: "marker-labels"
		          };
		        }
		      }
	};
	$scope.addProperty = function(){
		$scope.uploadAndSave();
	};
	$scope.$watch('photos', function(newVal){
		if(newVal != null){
			for (var i = 0; i < newVal.length; i++) {
				$scope.errorMsg = null;
				$scope.generateThumb(newVal[i]);
				$scope.photosToUpload.push(newVal[i]);
			}
		}
	});
	$scope.uploadAndSave = function(){
		if($scope.photosToUpload && $scope.photosToUpload.length){
			for (var i = 0; i < $scope.photosToUpload.length; i++) {
				uploadPhoto($scope.photosToUpload[i]);
            }
		}
	};
	$scope.removePhoto = function(photo){
		var index = $scope.photosToUpload.indexOf(photo);
		
		if(index > -1){
			$scope.photosToUpload.splice(index, 1);
		}
	};
	function uploadPhoto(photo){
    	photo.progress = 10;
        photo.upload = $upload.upload({
            url: API_URL+'properties/uploadPhoto',
            file: photo
        }).progress(function (evt) {
        	photo.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        	photo.progressMsg = photo.progress;
        }).success(function (data, status, headers, config) {
        	photo.progress = 100;
        	photo.progressMsg = "Success";
        	photo.error = false;
            $scope.property.imagePaths.push({path:data.success});
            if($scope.property.imagePaths.length == $scope.photosToUpload.length){
				$scope.property.$save(function(data){
					$state.go("showProperty",{
						propertyId:data.id
					});
				});
			}
        }).error(function(data,status,headers,config){
        	photo.progress = 100;
        	photo.progressMsg = "Error";
        	photo.error = true;
        });
	};
	$scope.generateThumb = function(file) {
		if (file != null) {
			if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
				$timeout(function() {
					var fileReader = new FileReader();
					fileReader.readAsDataURL(file);
					fileReader.onload = function(e) {
						$timeout(function() {
							file.dataUrl = e.target.result;
						});
					}
				});
			}
		}
	};
	$scope.addPropertyButtonDisabled = function(formObject){
		if(formObject.$valid && $scope.property.propertyFacilities.length > 0 && $scope.photosToUpload.length > 0){
			return false;
		}
		return true;
	};
	
}]);