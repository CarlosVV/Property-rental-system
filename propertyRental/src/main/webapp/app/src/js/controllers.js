/**
 * 
 */
var propertyController = angular.module("PropertyController",[]);

propertyController.controller("ShowPropertyCtrl", ["$scope","PropertyService","$resource","$stateParams","BookingService","$state",function($scope,PropertyService,$resource,$stateParams,BookingService,$state){
	$scope.currentUser = localStorage.getItem('currentUsername');
	$scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 16 };
	$scope.mapOptions = {scrollwheel: false};
	var checkInTemp = undefined;
	var checkOutTemp = undefined;
	if($stateParams.checkIn != "" || $stateParams.checkOut != ""){
		console.log("ok",$stateParams.checkIn);
		checkInTemp = moment($stateParams.checkIn,'DD/MM/YYYY')._d;
		checkOutTemp = moment($stateParams.checkOut,'DD/MM/YYYY')._d;
	}
	console.log(checkInTemp);
	
	$scope.booking = new BookingService.booking;
	$scope.booking.checkIn = checkInTemp;
	$scope.booking.checkOut = checkOutTemp;
	$scope.booking.guestNumber = parseInt($stateParams.guestNumber);
	$scope.booking.userAccount = {username:$scope.currentUser};
	$scope.booking.property = {id:$stateParams.propertyId};
	console.log($scope.booking);
	/*{
			checkIn:checkInTemp,
			checkOut:checkOutTemp,
			guestNumber:parseInt($stateParams.guestNumber)
	};*/
	$scope.property = new PropertyService.property.get({id:$stateParams.propertyId}, function(){
		$scope.map.center.latitude = $scope.property.latitude;
		$scope.map.center.longitude = $scope.property.longitude;
		$scope.marker = {
				id: 0,
			      coords: {
			        latitude: $scope.property.latitude,
			        longitude: $scope.property.longitude
			      },
			      options: { draggable: false }
		};
		console.log($scope.property);
		$scope.currentIndx = 0;
		$scope.mainImgUrl = $scope.property.imagePaths[0].path;
		$scope.maxGuests = $scope.property.guestCount;
	});
	$scope.setImg = function(img){
		$scope.mainImgUrl = img.path;
		$scope.currentIndx = $scope.property.imagePaths.indexOf(img);
	}
	$scope.nextImg = function(){
		if($scope.currentIndx == $scope.property.imagePaths.length - 1){
			$scope.setImg($scope.property.imagePaths[0]);
		}else{
			$scope.setImg($scope.property.imagePaths[$scope.currentIndx+1]);
		}
	}
	$scope.prevImg = function(){
		if($scope.currentIndx == 0){
			$scope.setImg($scope.property.imagePaths[$scope.property.imagePaths.length-1]);
		}else{
			$scope.setImg($scope.property.imagePaths[$scope.currentIndx-1]);
		}
	}
	$scope.unavailableDates = new PropertyService.unavailableDates.query({id:$stateParams.propertyId}, function(){
		console.log($scope.unavailableDates);
	});
	$scope.bookApartment = function(){
		
	};
	$scope.beforeRender = function($view, $dates, $leftDate, $upDate, $rightDate){
		if($scope.unavailableDates.length > 0){
			console.log("hm");
			for(var i=0;i<$dates.length;i++){
				var compare = moment($dates[i].utcDateValue);
				if(moment().diff(compare,'days') < 0){
					for(var j=0;j<$scope.unavailableDates.length;j++){
						var start = moment($scope.unavailableDates[j].startDate);
						var end = moment($scope.unavailableDates[j].endDate);
						if(compare.isBetween(start,end,'day') || compare.isSame(start,'day') || compare.isSame(end,'day')){
							$dates[i].selectable = false;
						}
					}
				}else{
					$dates[i].selectable = false;
				}
			}
		}else{
			console.log("nothing");
		}
	}
	$scope.bookApartment = function(){
		$scope.booking.$save();
		$state.go("showMyBookings");
	}
	
}]);
propertyController.controller("AddPropertyCtrl",["$scope","$timeout","$state","PropertyService","$upload","API_URL",function($scope,$timeout,$state,PropertyService,$upload,API_URL){
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
		$scope.hasNextStep = $scope.checkNextStep();
		$scope.hasPreviousStep = $scope.checkPreviousStep();
	};
	$scope.previousStep = function() {
		$scope.goToStep($scope.currentStep-1);
		$scope.hasPreviousStep = $scope.checkPreviousStep();
		$scope.hasNextStep = $scope.checkNextStep();
	};
	$scope.goToStep = function(index) {
	    if(typeof $scope.steps[index] !== 'undefined'){
	      $scope.currentStep = index;
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
		console.log("RESETING");
		$scope.property.city = "";
		$scope.property.administrativeArea = "";
		$scope.property.country = "";
		$scope.property.postalCode = "";
		$scope.streetNumber = "";
	};
	$scope.$watch('address',function(newVal){
		if(typeof $scope.address !== 'undefined'){
			if($scope.address == ""){
				console.log("new Val is empty set to",$scope.addressBackup);
				$scope.address = $scope.addressBackup;
			}else{
				$scope.addressBackup = $scope.address;
				console.log("newVal is ok",$scope.addressBackup);
			}
		}else{
			console.log("pls",$scope.addressBackup);
			$scope.address = $scope.addressBackup;
		}
	});
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
			console.log("SRSLY",$scope.streetNumber);
			$scope.property.address = street+streetNumber;
			
			$scope.marker.coords.latitude = newVal.geometry.location.k;
			$scope.marker.coords.longitude = newVal.geometry.location.D;
			$scope.map.center.latitude = newVal.geometry.location.k;
			$scope.map.center.longitude = newVal.geometry.location.D;
			$scope.map.zoom = 16;
			$scope.property.latitude = newVal.geometry.location.k;
			$scope.property.longitude = newVal.geometry.location.D;
			console.log($scope.property.address);
			console.log($scope.marker.coords.latitude);
			console.log($scope.marker.coords.longitude);
			console.log($scope.property.postalCode);
			console.log($scope.property.administrativeArea);
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
		console.log("adding",$scope.property);
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
			for (var i = 0; i < $scope.photosToUpload.length; i++) {
				console.log("UPLOADING",$scope.photosToUpload[i]);
				uploadPhoto($scope.photosToUpload[i]);
            }
		}
	}
	$scope.removePhoto = function(photo){
		var index = $scope.photosToUpload.indexOf(photo);
		console.log("SLICED",index);
		
		if(index > -1){
			$scope.photosToUpload.splice(index, 1);
			console.log($scope.photosToUpload);
		}
	}
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
	
}]);
propertyController.controller("HomeController",["$scope","PropertyService","$state","$filter","AccountService",function($scope,PropertyService,$state,$filter,AccountService){
	$scope.test = function(){
		$scope.query.checkIn = moment().format("DD/MM/YYYY");
	};
	$scope.neededAddressComponents = {
		locality : 'long_name',
		administrative_area_level_1: 'short_name',
		country: 'long_name'
	};
	$scope.addressAssembler = {
			locality:'city',
			administrative_area_level_1:'administrativeArea',
			country:'country'
	};
	$scope.$watch('query.checkIn',function(newVal){
		console.log("NEW VAL CHECKIN:",$scope.query.checkIn);
	});
	$scope.query = {};
	$scope.details = {};
	$scope.autoCompleteOptions = {watchEnter:false};
	//get address details for query
	$scope.$watch('details',function(newVal){
		if(typeof newVal.address_components !== 'undefined'){
			//resetting query object for new location
			$scope.query.city = "";
			$scope.query.administrativeArea = "";
			$scope.query.country = "";
			for(var i=0; i < newVal.address_components.length; i++){
				var addressType = newVal.address_components[i].types[0];
				if($scope.neededAddressComponents[addressType]){
					$scope.query[$scope.addressAssembler[addressType]] = newVal.address_components[i][$scope.neededAddressComponents[addressType]];
				}
			}
		}
		console.log("query: ",$scope.query);
	});
	
	$scope.queryProperties = function(){
		console.log("sending",$filter("date")($scope.query.checkIn,'dd/MM/yyyy'));
		$state.go("queryProperties",{
			address:$scope.query.address,
			country:$scope.query.country,
			city:$scope.query.city,
			admArea:$scope.query.administrativeArea,
			checkIn:$filter("date")($scope.query.checkIn,'dd/MM/yyyy'),
			checkOut:$filter("date")($scope.query.checkOut,'dd/MM/yyyy'),
			guestNumber:$scope.query.guestNumber
		});
	}
	$scope.resetQuery = function(){
		console.log("execute pls");
		$scope.query.city = "";
		$scope.query.administrativeArea = "";
		$scope.query.country = "";
		console.log($scope.query.city);
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
propertyController.controller("SearchPropertiesCtrl",["$scope", "PropertyService", "$stateParams", "$location","$filter", function($scope, PropertyService, $stateParams, $location,$filter){
	/*PropertyService.apartment.save($scope.query, function(){
	console.log("DATA SENT YAY");
	});*/
	$scope.queryToPass = {};
	$scope.$watch('query.checkIn',function(newVal){
		$scope.queryToPass.checkIn = $filter("date")($scope.query.checkIn,'dd/MM/yyyy');
	});
	$scope.$watch('query.checkOut',function(newVal){
		$scope.queryToPass.checkOut = $filter("date")($scope.query.checkOut,'dd/MM/yyyy');
	});
	$scope.neededAddressComponents = {
			locality : 'long_name',
			administrative_area_level_1: 'short_name',
			country: 'long_name'
	};
	$scope.addressAssembler = {
			locality:'city',
			administrative_area_level_1:'administrativeArea',
			country:'country'
	};
	console.log("we got ",$stateParams.checkIn,moment($stateParams.checkIn,'DD/MM/yyyy')._d);
	console.log("and ",$stateParams.checkOut,moment($stateParams.checkOut,'DD/MM/yyyy')._d);
	$scope.query = {
			address:$stateParams.address,
			country:$stateParams.country,
			city:$stateParams.city,
			administrativeArea:$stateParams.admArea,
			checkIn:moment($stateParams.checkIn,'DD/MM/YYYY')._d,
			checkOut:moment($stateParams.checkOut,'DD/MM/YYYY')._d,
			guestNumber:parseInt($stateParams.guestNumber)
	};
	console.log("what goes to datepicker::",$scope.query.checkIn);
	$scope.details = {};
	$scope.autoCompleteOptions = {watchEnter:false};
	$scope.$watch('details',function(newVal){
		if(typeof newVal.address_components !== 'undefined'){
			//resetting query object for new location
			$scope.query.locality = "";
			$scope.query.administrativeArea = "";
			$scope.query.country = "";
			for(var i=0; i < newVal.address_components.length; i++){
				var addressType = newVal.address_components[i].types[0];
				if($scope.neededAddressComponents[addressType]){
					$scope.query[$scope.addressAssembler[addressType]] = newVal.address_components[i][$scope.neededAddressComponents[addressType]];
				}
			}
		}
		console.log($scope.details);
		console.log("query: ",$scope.query);
	});
	$scope.properties = PropertyService.property.find($scope.query);
	$scope.queryProperties = function(query){
		var newUrl = "/queryProperties/"+$scope.query.address+"/"+$scope.query.country+"/"+$scope.query.city+"/"+$scope.query.administrativeArea+"/"+encodeURIComponent(moment($scope.query.checkIn).format('DD/MM/YYYY'))+"/"+encodeURIComponent(moment($scope.query.checkOut).format('DD/MM/YYYY'))+"/"+$scope.query.guestNumber;
		$location.path(newUrl).replace();
		$scope.properties = PropertyService.property.find($scope.query);
	}
	$scope.resetQuery = function(){
		$scope.query.city = "";
		$scope.query.administrativeArea = "";
		$scope.query.country = "";
	}
	//:country/:city/:admArea/:checkIn/:checkOut
}]);
propertyController.controller("UpdatePropertyCtrl",["$scope","PropertyService","$stateParams","API_URL","$timeout","$upload",function($scope,PropertyService,$stateParams,API_URL,$timeout,$upload){
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
}]);
propertyController.controller("ShowMyPropertiesCtrl",["$scope", "PropertyService","BookingService", function($scope, PropertyService,BookingService){
	/*PropertyService.apartment.save($scope.query, function(){
	console.log("DATA SENT YAY");
	});*/
	$scope.properties = PropertyService.property.findMyProperties();
	$scope.$watch('properties',function(newVal){
		console.log($scope.properties);
	});
	$scope.showPropertyBookedDays = function(id, chosenYear){
		$scope.propertyBookedDays = new BookingService.propertyBookedDays.get({id:id,year:chosenYear},function(){
			console.log($scope.propertyBookedDays);
			$scope.showChart = true;
		});
	}
}]);
propertyController.controller("LoginCtrl",["$scope","AccountService","$state","$rootScope", function($scope,AccountService,$state,$rootScope){
	console.log($scope.returnToState);
	$scope.login = function(){
		console.log($scope.userAccount);
		AccountService.login($scope.userAccount).then(function(){
			//redirecting to set in app $on stateChange state
			console.log($scope.returnToState);
			if($scope.returnToState){
				console.log("ITS ON RIGHT WAY",$scope.returnToState);
				$state.go($scope.returnToState.name, $scope.returnToStateParams);
			}else{
				$state.go("home");
			}
		});
	};
}]);
propertyController.controller("RegisterCtrl",["$scope","AccountService","$state",function($scope,AccountService,$state){
	$scope.userAccount = new AccountService.account;
	$scope.register = function(){
		console.log($scope.userAccount);
		$scope.userAccount.$save(function(returneData){
			AccountService.login($scope.userAccount).then(function(data){
				console.log("WTF");
				console.log(data);
				$state.go("home");
			});
		});
	};
	
}]);
propertyController.controller('LogoutCtrl', ["$scope","AccountService","$state","$rootScope",function($scope,AccountService,$state,$rootScope){
    $scope.service = new AccountService.logout();
}]);
propertyController.controller("ShowMyBookingsCtrl",["$scope","BookingService",function($scope,BookingService){
	$scope.bookings = new BookingService.booking.myBookings();
	$scope.$watch('bookings',function(newVal){
		console.log($scope.bookings);
	});
	
	
}]);