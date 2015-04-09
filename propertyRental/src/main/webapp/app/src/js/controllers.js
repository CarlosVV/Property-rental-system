
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
	$scope.unavailableDatesBetween = false;
	$scope.booking = new BookingService.booking;
	$scope.booking.checkIn = checkInTemp;
	$scope.booking.checkOut = checkOutTemp;
	$scope.booking.guestNumber = parseInt($stateParams.guestNumber);
	$scope.booking.userAccount = {username:$scope.currentUser};
	$scope.booking.property = {id:$stateParams.propertyId};
	
	$scope.newReview = {};
	$scope.comment = {};
	$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId},function(){
		console.log("WE GOT DEM REVIEWS", $scope.reviews);
	});
	$scope.stars = [1,2,3,4,5];
	$scope.canSendReviews = new PropertyService.reviews.canSendReviews({propertyId:$stateParams.propertyId},function(){
		console.log("soooo",$scope.canSendReviews);
	});
	$scope.reviewToComment = 0;
	$scope.commentReview = function(reviewId){
		if($scope.reviewToComment == reviewId){
			$scope.reviewToComment = 0;
		}else{
			$scope.reviewToComment = reviewId;
		}
	};
	$scope.addReview = function(parentReviewId,formObject){
		if(parentReviewId == 0){
			console.log($scope.newReview);
			PropertyService.reviews.save({id:$stateParams.propertyId},$scope.newReview,function(data){
				$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId});
				$scope.newReview = {};
				formObject.$setPristine();
			});
		}else{
			$scope.comment.parentReviewId = parentReviewId;
			console.log($scope.newReview.parentReviewId);
			PropertyService.reviews.save({id:$stateParams.propertyId},$scope.comment,function(data){
				$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId});
				$scope.comment = {};
				$scope.reviewToComment = 0;
				formObject.$setPristine();
			});
		}
	};
	
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
		//for filter
		if($scope.maxLength < $scope.property.description.length){
			$scope.showMoreDesc = "Show more";
		}
		if($scope.maxLength < $scope.property.rules.length){
			$scope.showMoreRules = "Show more";
		}
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
	$scope.beforeRender = function($view, $dates, $leftDate, $upDate, $rightDate){
		if($scope.unavailableDates.length > 0){
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
		//$scope.booking.userAccount.username = localStorage.getItem("currentUsername");
		console.log("CHEC");
		//part of validation moved here
		var thereAreErrors = false;
		if(!angular.isUndefined($scope.booking.checkOut) && !angular.isUndefined($scope.booking.checkIn)){
			console.log("OKAY");
		   var startDate = moment($scope.booking.checkIn);
		   var endDate = moment($scope.booking.checkOut);
		   var difference = endDate.diff(startDate,'days')+1;
		   console.log("DIF",difference);
		   if(difference >= $scope.property.minimumNights){
				for(var i=0;i<$scope.unavailableDates.length;i++){
					var start = moment($scope.unavailableDates[i].startDate);
					var end = moment($scope.unavailableDates[i].endDate);
					console.log("LOOP",i);
					if(start.isBetween($scope.booking.checkIn,$scope.booking.checkOut) || end.isBetween($scope.booking.checkIn,$scope.booking.checkOut)){
						console.log("YAY");
						thereAreErrors = true;
					}
		    	}
		   }else{
			   //too few days booked!
				thereAreErrors = true;
		   }
		}
		if(!thereAreErrors){
			console.log("should not",$scope.booking);
			$scope.booking.$save();
			$state.go("showMyBookings");
		}else{
			$scope.bookingForm.checkIn.$setValidity("validcheckIn", false);
			$scope.bookingForm.checkOut.$setValidity("validcheckOut", false);
			console.log("ERRORS");
		}
	}
	//filter
	$scope.showMoreDesc = "";
	$scope.showMoreRules = "";
	$scope.maxLength = 100;
	$scope.showMoar = function(whichText){
		var showMore = "Show more";
		var showLess = "Show less";
		if(whichText == 'desc'){
			if($scope.maxLength < $scope.property.description.length){
				if($scope.showMoreDesc == showMore){
					$scope.showMoreDesc = showLess;
				}else{
					$scope.showMoreDesc = showMore;
				}
			}
		}else{
			if($scope.maxLength < $scope.property.description.length){
				if($scope.showMoreRules == showMore){
					$scope.showMoreRules = showLess;
				}else{
					$scope.showMoreRules = showMore;
				}
			}
		}
	};
	//Reviews
	$scope.deleteReview = function(reviewId){
		PropertyService.reviews.remove({id:reviewId}, function(){
			console.log("DELETED");
			$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId});
		});
	};
	$scope.canComment = function(reviewId){
		for (var i = 0; i < $scope.reviews.length; i++) {
			if($scope.reviews[i].parentReviewId == reviewId){
				return false;
			}
		}
		return true;
	};
	
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
propertyController.controller("UpdatePropertyCtrl",["$scope","PropertyService","$stateParams","API_URL","$timeout","$upload","$state",function($scope,PropertyService,$stateParams,API_URL,$timeout,$upload,$state){
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
		var password = $scope.userAccount.password;
		console.log($scope.userAccount);
		$scope.userAccount.$save(function(returneData){
			$scope.userAccount.password = password;
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
propertyController.controller("ConversationsCtrl",["$scope","BookingService","$rootScope","$stateParams",function($scope,BookingService,$rootScope,$stateParams){
	$scope.myBookings = new BookingService.booking.myBookings(function(){
		console.log($scope.myBookings);
	});
	$scope.bookingsStatuses = new BookingService.bookingsStatuses.query();
	$scope.myPropertiesBookings = new BookingService.booking.allMyPropertiesBookings();
	$scope.newMsgsAvailable = function(bookingId){
		for(var i=0;i<$rootScope.newMsgs.length;i++){
			if($rootScope.newMsgs[i].bookingId == bookingId){
				return true;
			}
		}
		return false;
	};
}]);
propertyController.controller("ChatCtrl",["$scope","ConversationService","$stateParams","$rootScope",function($scope,ConversationService,$stateParams,$rootScope){
	console.log("YO DAWG");
	$scope.message = {};
	$scope.currentBooking = {};
	$scope.messages = new ConversationService.conversation.query({bookingId:$stateParams.bookingId},function(){
		if($rootScope.newMsgs.length){
			angular.forEach($rootScope.newMsgs, function(msg) {
				if(msg.bookingId == $stateParams.bookingId){
					ConversationService.conversation.markRead({bookingId:msg.bookingId});
				}
			});
		}
	});
	//watching for new msgs while we are in chat
	$rootScope.$watch('newMsgs',function(newVal){
		console.log("WHY",newVal.length);
		if($rootScope.newMsgs.length){
			var gotNew = false;
			for(var i=0;i<$rootScope.newMsgs.length;i++){
				if($rootScope.newMsgs[i].bookingId == $stateParams.bookingId){
					$scope.messages.push($rootScope.newMsgs[i]);
					$rootScope.newMsgs.splice(i,1);
					gotNew = true;
					i--;
				}
			}
			if(gotNew){
				ConversationService.conversation.markRead({bookingId:$stateParams.bookingId});
			}
		}
	},true);
	$scope.$watchGroup(['bookingsStatuses','myBookings','myPropertiesBookings',function(){
		if(!angular.isUndefined($scope.bookingsStatuses) && !angular.isUndefined($scope.myBookings) && 
				!angular.isUndefined($scope.myPropertiesBookings)){
			var foundInMyBookings = false;
			angular.forEach($scope.myBookings, function(booking) {
				if(booking.bookingId == $stateParams.bookingId){
					$scope.currentBooking = booking;
					foundInMyBookings = true;
				}
			});
			if(!foundInMyBookings){
				angular.forEach($scope.myPropertiesBookings, function(booking) {
					if(booking.bookingId == $stateParams.bookingId){
						$scope.currentBooking = booking;
					}
				});
			}
		}
	}]);
	
	$scope.sendMessage = function(formObject){
		var foundInMyBookings = false;
		angular.forEach($scope.myBookings, function(booking) {
			if(booking.bookingId == $stateParams.bookingId){
				$scope.message.receiverUsername = booking.propertyAccountUsername;
				$scope.message.senderUsername = localStorage.getItem("currentUsername");
				foundInMyBookings = true;
			}
		});
		if(!foundInMyBookings){
			angular.forEach($scope.myPropertiesBookings, function(booking) {
				if(booking.bookingId == $stateParams.bookingId){
					$scope.message.receiverUsername = booking.userAccountUsername;
					$scope.message.senderUsername = localStorage.getItem("currentUsername");
				}
			});
		}
		$scope.message.bookingId = $stateParams.bookingId;
		$scope.message.senderUsername = localStorage.getItem("currentUsername");
		ConversationService.conversation.save({},$scope.message,function(newMsg){
			$scope.messages.push(newMsg);
			$scope.message = {};
			formObject.$setPristine();
		});
	};
}]);




propertyController.controller("ShowMyPropertiesCtrl",["$scope", "PropertyService","BookingService", function($scope, PropertyService,BookingService){
	/*$scope.bookingsStatuses = BookingService.bookingsStatuses.query();
	$scope.selectedChartId;
	$scope.selectedBookingsPropertyId;
	$scope.selectedYear = moment().year();*/
	$scope.properties = PropertyService.property.findMyProperties(function(){
		//generating data for select statistics
		console.log("HMMM",$scope.properties);
		var currentTime = moment();
		for(var i=0;i<$scope.properties.length;i++){
			var createdYear = moment($scope.properties[i].createdDate).year();
			$scope.properties[i].availableYears = [];
			var difference = currentTime.year() - createdYear;
			for(var j=0;j<=difference;j++){
				$scope.properties[i].availableYears.push(createdYear+j);
			}
		}
	});
	/*$scope.$watch('selectedYear',function(){
		console.log("OMG PLS"+$scope.selectedYear);
	});*/
	/*$scope.showPropertyBookedDays = function(id,closable){
		if(id == $scope.selectedChartId && closable){
			$scope.selectedChartId = 0;
		}else{
			console.log($scope.selectedYear);
			$scope.propertyBookedDays = new BookingService.propertyBookedDays.query({id:id,year:$scope.selectedYear},function(){
				
				var dataToShow = [];
				for(var i=0;i<$scope.propertyBookedDays.length;i++){
					var month = moment([2015,$scope.propertyBookedDays[i].month-1]).format("MMMM");
					dataToShow.push([month,$scope.propertyBookedDays[i].bookedDays]);
				}
				console.log(dataToShow);
				$scope.chartConfig = {
					options:{
						title:{
							text:"Booked days in each month"
						}
					},
					series:[],
					xAxis:{
						title:{text:"Months"},
						categories:[]
					}
				};
				$scope.chartConfig.series.push({data:dataToShow});
				console.log($scope.propertyBookedDays);
				$scope.selectedChartId = id;
				$scope.showChart = true;
			});
		}
	};*/
	/*$scope.showPropertyBookings = function(id){
		if(id == $scope.selectedBookingsPropertyId){
			$scope.selectedBookingsPropertyId = 0;
		}else{
			$scope.propertyBookings = BookingService.booking.myPropertiesBookings({propertyId:id},function(){
				$scope.selectedBookingsPropertyId = id;
				console.log($scope.propertyBookings);
			});
		}
	};*/
	/*$scope.lastActionBookingId;
	$scope.lastStatus;
	$scope.setBookingStatusPayed = function(bookingId){
		var currentBookingId;//null if not found
		var currentBookingPosition;
		for(var i=0;i<$scope.propertyBookings.length;i++){
			if($scope.propertyBookings[i].bookingId == bookingId){
				currentBookingId = bookingId;
				currentBookingPosition = i;
			}
		}
		if(currentBookingId != null && currentBookingPosition != null){
			$scope.lastStatus = $scope.propertyBookings[currentBookingPosition].bookingStatusId;
			BookingService.bookingsStatuses.updateBookingStatus({bookingId:bookingId,statusId:2},function(){
				$scope.propertyBookings[currentBookingPosition].bookingStatusId = 2;
			});
			$scope.lastActionBookingId = bookingId;
		}
	};
	$scope.cancelBooking = function(bookingId){
		var currentBookingId;//null if not found
		var currentBookingPosition;
		for(var i=0;i<$scope.propertyBookings.length;i++){
			if($scope.propertyBookings[i].bookingId == bookingId){
				currentBookingId = bookingId;
				currentBookingPosition = i;
			}
		}
		if(currentBookingId != null && currentBookingPosition != null){
			$scope.lastStatus = $scope.propertyBookings[currentBookingPosition].bookingStatusId;
			BookingService.bookingsStatuses.updateBookingStatus({bookingId:bookingId,statusId:3},function(){
				$scope.propertyBookings[currentBookingPosition].bookingStatusId = 3;
			});
			$scope.lastActionBookingId = bookingId;
		}
	};
	$scope.annulLastAction = function(bookingId){
		if($scope.lastActionBookingId == bookingId && $scope.lastStatus != null){
			var currentBookingPosition;
			for(var i=0;i<$scope.propertyBookings.length;i++){
				if($scope.propertyBookings[i].bookingId == bookingId){
					currentBookingId = bookingId;
					currentBookingPosition = i;
				}
			}
			BookingService.bookingsStatuses.updateBookingStatus({bookingId:bookingId,statusId:$scope.lastStatus},function(){
				$scope.propertyBookings[currentBookingPosition].bookingStatusId = $scope.lastStatus;
				$scope.lastActionBookingId = 0;
				$scope.lastStatus = 0;
			});
		}
	};*/
	/*//unavailable dates:
	$scope.selectedUnDatesPropertyId;
	$scope.currentUnDates;
	$scope.currentBookedDates;
	$scope.datesUpdated = true;
	$scope.$watch('newUnDates',function(){
		console.log("PLS",$scope.newUnDates);
	});
	//to prevent from $scope.datesUpdated = false; and $apply (digest in progress error)
	var firstTime;
	$scope.showPropertyUnavailableDates = function(propertyId){
		if($scope.selectedUnDatesPropertyId != propertyId){
			firstTime = true;
			$scope.datesUpdated = true;
			$scope.selectedUnDatesPropertyId = propertyId;
			$scope.currentUnDates = new PropertyService.onlyUnavailableDays.query({id:propertyId});
			$scope.currentBookedDates = new PropertyService.onlyBookedDays.query({id:propertyId});
		}else{
			$scope.selectedUnDatesPropertyId = 0;
		}
	};
	$scope.newUnDates;
	$scope.updateUnDates = function(dates){
		//it's executed once on datepicker startup
		if(!firstTime){
			$scope.newUnDates = dates;
			$scope.datesUpdated = false;
			//should update!
			$scope.$apply();
			console.log("WHAT SCOPE OMG",$scope);
		}else{
			firstTime = false;
		}
	};
	$scope.sendUnDates = function(){
		console.log("UPDATING",$scope.currentUnDates);
		PropertyService.onlyUnavailableDays.update({id:$scope.selectedUnDatesPropertyId},$scope.newUnDates,function(){
			console.log("UPdated");
			$scope.datesUpdated = true;
		});
	};*/
}]);
propertyController.controller("ShowMyPropertyCtrl",["$scope", "PropertyService","BookingService","$stateParams", function($scope, PropertyService,BookingService,$stateParams){
	$scope.bookingsStatuses = BookingService.bookingsStatuses.query();
	$scope.bookedDaysYear = moment().year();
	//need to find current property, $scope.$watch('',fn,TRUE)!!!
	$scope.currentProperty = {};
	$scope.$watch('properties',function(){
		for(var i=0;i<$scope.properties.length;i++){
			if($scope.properties[i].id == $stateParams.propertyId){
				$scope.currentProperty = $scope.properties[i];
				$scope.showPropertyBookedDays($scope.properties[i].id);
				break;
			}
		}
	},true);
	
	$scope.$watch('selectedYear',function(){
		console.log("OMG PLS"+$scope.bookedDaysYear);
	});
	$scope.showPropertyBookedDays = function(id){
		$scope.propertyBookedDays = new BookingService.propertyBookedDays.query({id:$stateParams.propertyId,year:$scope.bookedDaysYear},function(){
			var dataToShow = [];
			for(var i=0;i<$scope.propertyBookedDays.length;i++){
				var month = moment([2015,$scope.propertyBookedDays[i].month-1]).format("MMMM");
				dataToShow.push([month,$scope.propertyBookedDays[i].bookedDays]);
			}
			console.log(dataToShow);
			$scope.chartConfig = {
				options:{
					title:{
						text:"Booked days in each month"
					}
				},
				series:[],
				xAxis:{
					title:{text:"Months"},
					categories:[]
				}
			};
			$scope.chartConfig.series.push({data:dataToShow});
			console.log($scope.propertyBookedDays);
			$scope.showChart = true;
		});
	}
	
	
	$scope.propertyBookings = BookingService.booking.myPropertiesBookings({propertyId:$stateParams.propertyId},function(){
		console.log($scope.propertyBookings);
	});
	
	
	$scope.lastActionBookingId;
	$scope.lastStatus;
	$scope.setBookingStatusPayed = function(bookingId){
		var currentBookingId;//null if not found
		var currentBookingPosition;
		for(var i=0;i<$scope.propertyBookings.length;i++){
			if($scope.propertyBookings[i].bookingId == bookingId){
				currentBookingId = bookingId;
				currentBookingPosition = i;
			}
		}
		if(currentBookingId != null && currentBookingPosition != null){
			$scope.lastStatus = $scope.propertyBookings[currentBookingPosition].bookingStatusId;
			BookingService.bookingsStatuses.updateBookingStatus({bookingId:bookingId,statusId:2},function(){
				$scope.propertyBookings[currentBookingPosition].bookingStatusId = 2;
			});
			$scope.lastActionBookingId = bookingId;
		}
	};
	$scope.cancelBooking = function(bookingId){
		var currentBookingId;//null if not found
		var currentBookingPosition;
		for(var i=0;i<$scope.propertyBookings.length;i++){
			if($scope.propertyBookings[i].bookingId == bookingId){
				currentBookingId = bookingId;
				currentBookingPosition = i;
			}
		}
		if(currentBookingId != null && currentBookingPosition != null){
			$scope.lastStatus = $scope.propertyBookings[currentBookingPosition].bookingStatusId;
			BookingService.bookingsStatuses.updateBookingStatus({bookingId:bookingId,statusId:3},function(){
				$scope.propertyBookings[currentBookingPosition].bookingStatusId = 3;
			});
			$scope.lastActionBookingId = bookingId;
		}
	};
	$scope.annulLastAction = function(bookingId){
		if($scope.lastActionBookingId == bookingId && $scope.lastStatus != null){
			var currentBookingPosition;
			for(var i=0;i<$scope.propertyBookings.length;i++){
				if($scope.propertyBookings[i].bookingId == bookingId){
					currentBookingId = bookingId;
					currentBookingPosition = i;
				}
			}
			BookingService.bookingsStatuses.updateBookingStatus({bookingId:bookingId,statusId:$scope.lastStatus},function(){
				$scope.propertyBookings[currentBookingPosition].bookingStatusId = $scope.lastStatus;
				$scope.lastActionBookingId = 0;
				$scope.lastStatus = 0;
			});
		}
	};
	
	
	
	//unavailable dates:
	$scope.selectedUnDatesPropertyId;
	$scope.currentUnDates;
	$scope.currentBookedDates;
	$scope.datesUpdated = true;
	$scope.$watch('newUnDates',function(){
		console.log("PLS",$scope.newUnDates);
	});
	//to prevent from $scope.datesUpdated = false; and $apply (digest in progress error)
	var firstTime;
	firstTime = true;
	$scope.datesUpdated = true;
	$scope.selectedUnDatesPropertyId = $stateParams.propertyId;
	$scope.currentUnDates = new PropertyService.onlyUnavailableDays.query({id:$stateParams.propertyId});
	$scope.currentBookedDates = new PropertyService.onlyBookedDays.query({id:$stateParams.propertyId});
	$scope.newUnDates;
	$scope.updateUnDates = function(dates){
		//it's executed once on datepicker startup
		if(!firstTime){
			$scope.newUnDates = dates;
			$scope.datesUpdated = false;
			//should update!
			$scope.$apply();
			console.log("WHAT SCOPE OMG",$scope);
		}else{
			firstTime = false;
		}
	};
	$scope.sendUnDates = function(){
		console.log("UPDATING",$scope.currentUnDates);
		PropertyService.onlyUnavailableDays.update({id:$scope.selectedUnDatesPropertyId},$scope.newUnDates,function(){
			console.log("UPdated");
			$scope.datesUpdated = true;
		});
	};
	
}]);
