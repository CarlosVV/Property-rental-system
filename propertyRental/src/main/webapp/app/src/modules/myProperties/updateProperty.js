var updateProperty = angular.module("updateProperty",[]);
updateProperty.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showMyProperties.detail.update",{
		url:"/update",
		templateUrl:"modules/myProperties/partials/updateProperty.html",
		controller:"UpdatePropertyCtrl",
        data : {
        	authorities:['ROLE_USER']
        }
	});
}]);
updateProperty.controller("UpdatePropertyCtrl",["$scope","PropertyService","$stateParams","API_URL","$timeout","$upload","$state",function($scope,PropertyService,$stateParams,API_URL,$timeout,$upload,$state){
	$scope.uploadingPhotos = false;
	$scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 16 };
	$scope.property = {};
	$scope.photosToUpload = [];
	$scope.photosBackup = [];
	$scope.property.propertyFacilities = [];
	$scope.details={};
	$scope.propertyTypes = PropertyService.propertyTypes.query();
	$scope.propertyFacilities = PropertyService.propertyFacilities.query(function(){
		console.log($scope.propertyFacilities);
	});
	$scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
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
	
	$scope.property = new PropertyService.property.get({id:$stateParams.propertyId}, function(){
		if($scope.property.userAccount.username != localStorage.getItem("currentUsername")){
			$state.go("accessDenied");
		}else{
			$scope.photosToUpload = $scope.photosToUpload.concat($scope.property.imagePaths);
			console.log($scope.photosToUpload);
			console.log("GOT IT",$scope.property);
			$scope.map.center.latitude = $scope.property.latitude;
			$scope.map.center.longitude = $scope.property.longitude;
			$scope.marker = {
					id: 0,
				      coords: {
				        latitude: $scope.property.latitude,
				        longitude: $scope.property.longitude
				      },
				      options: { draggable: true }
			};
			$scope.address = $scope.property.address;
		}
	});
	
	//get address for property
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
			$scope.property.address = street+streetNumber;
			
			$scope.marker.coords.latitude = newVal.geometry.location.k;
			$scope.marker.coords.longitude = newVal.geometry.location.D;
			$scope.map.center.latitude = newVal.geometry.location.k;
			$scope.map.center.longitude = newVal.geometry.location.D;
			$scope.map.zoom = 16;
			$scope.property.latitude = newVal.geometry.location.k;
			$scope.property.longitude = newVal.geometry.location.D;
		}
	});
	
	$scope.removePhoto = function(photo){
		var index = $scope.photosToUpload.indexOf(photo);
		if(index > -1){
			$scope.photosToUpload.splice(index, 1);
			$scope.photosBackup.push(photo);
			console.log("upload:",$scope.photosToUpload);
			console.log("backup",$scope.photosBackup);
		}
	};
	$scope.restorePhoto = function(photo){
		var index = $scope.photosBackup.indexOf(photo);
		if(index > -1){
			$scope.photosBackup.splice(index, 1);
			$scope.photosToUpload.push(photo);
			console.log("upload:",$scope.photosToUpload);
			console.log("backup",$scope.photosBackup);
		}
	};

	$scope.updateProperty = function(){
		console.log("updating",$scope.property.propertyFacilities);
		//some bug that spring mvc refuses to save object with added property facility (400 (Bad Request))
		for(var i=0;i<$scope.property.propertyFacilities.length;i++){
			delete $scope.property.propertyFacilities[i]["atpropertyFacilityId"];
		}
		$scope.uploadAndSave();
	};
	$scope.$watch('photos', function(newVal){
		console.log("WORKS?", newVal);
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
			$scope.property.imagePaths = [];
			//$scope.property.imagePaths = $scope.photosToUpload;
			for (var i = 0; i < $scope.photosToUpload.length; i++) {
				if(typeof $scope.photosToUpload[i].path === 'undefined'){
					$scope.uploadingPhotos = true;
					console.log("UPLOADING",$scope.photosToUpload[i]);
					uploadPhoto($scope.photosToUpload[i]);
				}else{
					$scope.property.imagePaths.push($scope.photosToUpload[i]);
				}
            }
			if(!$scope.uploadingPhotos){
				$scope.property.$update({id:$scope.property.id},function(data){
					console.log("COMPLETED",data);
					$state.go("showProperty",{
						propertyId:$scope.property.id
					});
				});
			}
		}
	};
	function uploadPhoto(photo){
        console.log(API_URL+'properties/uploadPhoto');
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
            console.log('file ' + config.file.name + 'uploaded. Response: ' + data.success);
            $scope.property.imagePaths.push({path:data.success});
            //only when the last photo was uploaded
            if($scope.property.imagePaths.length == $scope.photosToUpload.length){
            	console.log('imagepaths ',$scope.property.imagePaths);
            	console.log('and photostoupload ',$scope.photosToUpload);
            	console.log("SENDING DATA: ",$scope.property);
				$scope.property.$update({id:$scope.property.id},function(data){
					console.log("COMPLETED",data);
					$state.go("showProperty",{
						propertyId:$scope.property.id
					});
				});
			}
        }).error(function(data,status,headers,config){
        	photo.progress = 100;
        	photo.progressMsg = "Error";
        	photo.error = true;
        });
	}
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
	$scope.updateButtonDisabled = function(formObject){
		if(formObject.$valid && $scope.property.propertyFacilities.length > 0 && $scope.photosToUpload.length > 0){
			return false;
		}
		return true;
	};
}]);