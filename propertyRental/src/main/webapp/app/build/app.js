/**
 * 
 */

/**
 * 
 */
var rentalApp = angular.module('RentalApp',
	[
	 'ui.router',
	 'ngResource',
	 'uiGmapgoogle-maps',
	 'ngAutocomplete',
	 'ui.bootstrap.datetimepicker',
	 'angularFileUpload',
	 'highcharts-ng',
	 'ui.bootstrap',
	 'home',
	 'addProperty',
	 'login',
	 'register',
	 'logout',
	 'searchProperties',
	 'myBookings',
	 'showProperty',
	 'conversations',
	 'chat',
	 'myProperties',
	 'myProperty',
	 'myPropertyStatistics',
	 'updateProperty',
	 'myPropertyBookings',
	 'myPropertyUnavailableDates',
	 'PropertyServiceModule',
	 'BookingServiceModule',
	 'ConversationServiceModule',
	 'AccountServiceModule',
	 'BookingDatesDirective',
	 'DatepickerDirective',
	 'BookingStatusDirective',
	 'CheckListDirective',
	 'ValidateQueryDirective',
	 'GroupBookingsByDateDirective',
	 'SortingFilters',
	 'TruncateFilter',
	 'HttpInterceptorService'
	 ]
);

rentalApp.constant('API_URL',"/propertyRental/api/");
rentalApp.constant('APP_URL',"/propertyRental/");

rentalApp.config(["$stateProvider","$urlRouterProvider",'$httpProvider', function($stateProvider,$urlRouterProvider,$httpProvider){
		$urlRouterProvider.otherwise("/");
		$httpProvider.interceptors.push('httpErrorResponseInterceptor');
}]);

rentalApp.run(["$rootScope","$state","ConversationService","$interval",function($rootScope, $state,ConversationService,$interval){
	$rootScope.isLoggedIn = function(){
		var result = localStorage.getItem("currentUsername") !== null;
		return result;
	};
	$rootScope.getAuthority = function(){
		return localStorage.getItem("authority");
	};
	$rootScope.currentUsername = localStorage.getItem("currentUsername");
	//although it's checked on login but when user hard refeshs page it should check anyway
	if($rootScope.isLoggedIn()){
		$rootScope.newMsgs = new ConversationService.conversation.query({},function(){
			if($rootScope.newMsgs.length){
				$rootScope.$broadcast("newMessages");
			}
		});
	}
	//checking messages every 10 sec
	var checkNewMsgs = $interval(function(){
		if($rootScope.isLoggedIn()){
			$rootScope.newMsgs = new ConversationService.conversation.query({},function(){
				if($rootScope.newMsgs.length){
					$rootScope.$broadcast("newMessages");
				}
			});
		}
	},5000);
	//to redirect to right page after login
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams){
        $rootScope.pageTitle = toState.data.pageTitle + " - Property rental system";
        if(toState.url != '/login'){
	        $rootScope.returnToState = toState;
	        $rootScope.returnToStateParams = toStateParams;
        }
        if(toState.data.authorities.length != 0){
	        if($rootScope.isLoggedIn() && toState.data.authorities.indexOf($rootScope.getAuthority()) == -1){
	            event.preventDefault();
	        	$state.go('accessDenied');
	        }else if(!$rootScope.isLoggedIn()){
		            event.preventDefault();
		            $state.go('login');
	        }
        }
    });
}]);;var addProperty = angular.module("addProperty",[]);
addProperty.config(["$stateProvider",function($stateProvider){
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
	
}]);;var chat = angular.module("chat",[]);
chat.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("conversations.chat",{
    	url:"/{bookingId}",
    	templateUrl:"modules/conversations/partials/chat.html",
    	controller:"ChatCtrl",
        data : {
        	authorities:['ROLE_USER']
        }
    });
}]);
chat.controller("ChatCtrl",["$scope","ConversationService","$stateParams","$rootScope",function($scope,ConversationService,$stateParams,$rootScope){
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
	/*$rootScope.$watch('newMsgs',function(newVal){
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
	},true);*/
	$scope.$on("newMessages",function(){
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
	});
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
				foundInMyBookings = true;
			}
		});
		if(!foundInMyBookings){
			angular.forEach($scope.myPropertiesBookings, function(booking) {
				if(booking.bookingId == $stateParams.bookingId){
					$scope.message.receiverUsername = booking.userAccountUsername;
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
}]);;var conversations = angular.module("conversations",[]);
conversations.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("conversations",{
    	abstract:true,
    	url:"/conversations",
    	views:{
    		"mainView":{
    			templateUrl:"modules/conversations/partials/conversations.html",
    			controller:"ConversationsCtrl"
    		}
    	},
        data : {
        	authorities:['ROLE_USER'],
        	pageTitle:"Conversations"
        }
    })
    .state("conversations.pleaseSelect",{
    	url:"",
    	templateUrl:"modules/conversations/partials/pleaseSelect.html",
        data : {
        	authorities:['ROLE_USER']
        }
    });
}]);
conversations.controller("ConversationsCtrl",["$scope","BookingService","$rootScope","$stateParams",function($scope,BookingService,$rootScope,$stateParams){
	$scope.myBookings = new BookingService.booking.myBookings();
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
}]);;var home = angular.module("home",[]);

home.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("home", {
		url:"/",
		views: {
			"mainView":{
				templateUrl:"modules/home/partials/home.html",
				controller:"HomeController"
			}
		},
        data : {
        	authorities:[],
        	pageTitle:"Home"
        }
	});
}]);

home.controller("HomeController",["$scope","PropertyService","$state","$filter","AccountService",function($scope,PropertyService,$state,$filter,AccountService){
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
	});
	
	$scope.queryProperties = function(){
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
		$scope.query.city = "";
		$scope.query.administrativeArea = "";
		$scope.query.country = "";
	};
	//old way, should use directive instead!
	//moreover it is incorrect to use such method! cuz i am changing value of the variable but datepicker consumes moment object not string!
	//not sure how to show it in thesis.
	//i think i will just create directive for above $scope.$watch('details',f...
	/*$scope.$watch('data.dateDropDownInput',function(newVal){
		if(typeof $scope.data !== 'undefined'){
			$scope.data.dateDropDownInput = $filter("date")(newVal,'dd-MM-yyyy');
		}
	});*/
	$scope.beforeRender = function($view, $dates, $leftDate, $upDate, $rightDate){
		for(var i=0;i<$dates.length;i++){
			var compare = moment($dates[i].utcDateValue);
			if(moment().diff(compare,'days') > 0){
				$dates[i].selectable = false;
			}
		}
	};
}]);;var myBookings = angular.module("myBookings",[]);
home.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showMyBookings",{
		url:"/showMyBookings",
		views:{
			"mainView":{
				templateUrl:"modules/myBookings/partials/showMyBookings.html",
				controller:"ShowMyBookingsCtrl"
			}
		},
        data : {
        	authorities:["ROLE_USER"],
        	pageTitle:"My bookings"
        }
	});
}]);
myBookings.controller("ShowMyBookingsCtrl",["$scope","BookingService","$filter",function($scope,BookingService,$filter){
	$scope.currentPage = 1;
    $scope.itemsPerPage = 2;
    $scope.showOnlyStatus = "";
    $scope.showOnlyYear = "";
    $scope.showOnlyCheckInYear = "";
	$scope.availableYears = [];
	$scope.checkInAvailableYears = [];
	$scope.bookings = new BookingService.booking.myBookings(function(){
		for(var i=0;i<$scope.bookings.length;i++){
			//for creation date
			var createdYear = moment($scope.bookings[i].bookedDate).year();
			var found = false;
			for(var j=0;j<=$scope.availableYears.length;j++){
				if($scope.availableYears[j] == createdYear){
					found = true;
				}
			}
			if(!found){
				$scope.availableYears.push(createdYear);
			}
			//for check in
			var checkInYear = moment($scope.bookings[i].checkIn).year();
			var checkInFound = false;
			for(var j=0;j<=$scope.checkInAvailableYears.length;j++){
				if($scope.checkInAvailableYears[j] == checkInYear){
					checkInFound = true;
				}
			}
			if(!checkInFound){
				$scope.checkInAvailableYears.push(checkInYear);
			}
		}
        var from = ($scope.currentPage - 1) * $scope.itemsPerPage;
        var to = from + $scope.itemsPerPage;
        $scope.filteredBookings = $scope.bookings;
	});
	$scope.bookingsStatuses = BookingService.bookingsStatuses.query();
	//Because of pagination was forced to move all filtering logic to controllers
    $scope.$watch('showOnlyStatus',function(){
    	$scope.currentPage = 1;
		$scope.filteredBookings = $filter('filter')($scope.bookings,$scope.showOnlyStatus);
		$scope.filteredBookings = $filter('sortByYearBooking')($scope.filteredBookings,$scope.showOnlyYear);
		$scope.filteredBookings = $filter('sortByCheckInBooking')($scope.filteredBookings,$scope.showOnlyCheckInYear);
    });
    $scope.$watch('showOnlyYear',function(){
    	$scope.currentPage = 1;
		$scope.filteredBookings = $filter('sortByYearBooking')($scope.bookings,$scope.showOnlyYear);
		$scope.filteredBookings = $filter('filter')($scope.filteredBookings,$scope.showOnlyStatus);
		$scope.filteredBookings = $filter('sortByCheckInBooking')($scope.filteredBookings,$scope.showOnlyCheckInYear);
    });
    $scope.$watch('showOnlyCheckInYear',function(){
    	$scope.currentPage = 1;
		$scope.filteredBookings = $filter('sortByYearBooking')($scope.bookings,$scope.showOnlyYear);
		$scope.filteredBookings = $filter('filter')($scope.filteredBookings,$scope.showOnlyStatus);
		$scope.filteredBookings = $filter('sortByCheckInBooking')($scope.filteredBookings,$scope.showOnlyCheckInYear);
    });
}]);;var myProperties = angular.module("myProperties",[]);
myProperties.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showMyProperties",{
		abstract:true,
		url:"/showMyProperties",
		views:{
			"mainView":{
				templateUrl:"modules/myProperties/partials/propertyList.html",
				controller:"ShowMyPropertiesCtrl"
			}
		},
        data : {
            	authorities:['ROLE_USER'],
            	pageTitle:"My properties"
        }
	})
	.state("showMyProperties.pleaseSelect",{
    	url:"",
    	templateUrl:"modules/myProperties/partials/pleaseSelect.html",
        data : {
        	authorities:['ROLE_USER']
        }
    });
}]);
myProperties.controller("ShowMyPropertiesCtrl",["$scope", "PropertyService","BookingService", function($scope, PropertyService,BookingService){
	/*$scope.bookingsStatuses = BookingService.bookingsStatuses.query();
	$scope.selectedChartId;
	$scope.selectedBookingsPropertyId;
	$scope.selectedYear = moment().year();*/
	$scope.properties = PropertyService.property.findMyProperties(function(){
		//generating data for select statistics
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
}]);;var myProperty = angular.module("myProperty",[]);
myProperty.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showMyProperties.detail",{
		url:"/{propertyId}",
		templateUrl:"modules/myProperties/partials/details.html",
		controller:"ShowMyPropertyCtrl",
        data : {
        	authorities:['ROLE_USER']
        }
	});
}]);
myProperty.controller("ShowMyPropertyCtrl",["$scope", "PropertyService","BookingService","$stateParams", function($scope, PropertyService,BookingService,$stateParams){
	//accessing parent scope
	$scope.$parent.selectedPropertyId = $stateParams.propertyId;
	//need to find current property, $scope.$watch('',fn,TRUE)!!!
	$scope.currentProperty = {};
	$scope.$watch('properties',function(){
		for(var i=0;i<$scope.properties.length;i++){
			if($scope.properties[i].id == $stateParams.propertyId){
				$scope.currentProperty = $scope.properties[i];
				break;
			}
		}
	},true);
}]);;var myPropertyBookings = angular.module("myPropertyBookings",[]);
myPropertyBookings.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showMyProperties.detail.bookings",{
		url:"/bookings",
		templateUrl:"modules/myProperties/partials/bookings.html",
		controller:"ShowMyPropertyBookingsCtrl",
        data : {
        	authorities:['ROLE_USER']
        }
	});
}]);
myPropertyBookings.controller("ShowMyPropertyBookingsCtrl",["$scope", "PropertyService","BookingService","$stateParams","$filter", function($scope, PropertyService,BookingService,$stateParams,$filter){
	$scope.availableYears = [];
	$scope.checkInAvailableYears = [];
	$scope.currentPage = 1;
    $scope.itemsPerPage = 2;
    $scope.showOnlyStatus = "";
    $scope.showOnlyYear = "";
    $scope.showOnlyCheckInYear = "";
    
    $scope.testBookings = [];
    
	$scope.propertyBookings = BookingService.booking.myPropertiesBookings({propertyId:$stateParams.propertyId},function(){
		for(var i=0;i<$scope.propertyBookings.length;i++){
			var createdYear = moment($scope.propertyBookings[i].bookedDate).year();
			var found = false;
			for(var j=0;j<=$scope.availableYears.length;j++){
				if($scope.availableYears[j] == createdYear){
					found = true;
				}
			}
			if(!found){
				$scope.availableYears.push(createdYear);
			}
			var checkInYear = moment($scope.propertyBookings[i].checkIn).year();
			var checkInFound = false;
			for(var j=0;j<=$scope.checkInAvailableYears.length;j++){
				if($scope.checkInAvailableYears[j] == checkInYear){
					checkInFound = true;
				}
			}
			if(!checkInFound){
				$scope.checkInAvailableYears.push(checkInYear);
			}
			$scope.testBookings.push({
				id:$scope.propertyBookings[i].bookingId,
				user:$scope.propertyBookings[i].userAccountUsername,
				price:$scope.propertyBookings[i].price,
				bookedDate:$scope.propertyBookings[i].bookedDate,
				status:status,
				checkIn:$scope.propertyBookings[i].checkIn,
				checkOut:$scope.propertyBookings[i].checkOut
			});
		}
		$scope.filteredBookings = $scope.propertyBookings;
	});
	$scope.bookingsStatuses = BookingService.bookingsStatuses.query();
	$scope.$watch('bookingsStatuses',function(){
		if($scope.bookingsStatuses.length && $scope.propertyBookings.length){
		  for(var i=0;i<$scope.testBookings.length;i++){
			  for(var j=0;j<$scope.bookingsStatuses.length;j++){
				if($scope.bookingsStatuses[j].id == $scope.propertyBookings[i].bookingStatusId){
					$scope.testBookings[i].status = $scope.bookingsStatuses[j].name;
					break;
				}
			  }
		  }
		}
	},true);
	$scope.$watch('testBookings',function(){
		if($scope.bookingsStatuses.length && $scope.testBookings.length){
		  for(var i=0;i<$scope.testBookings.length;i++){
			  for(var j=0;j<$scope.bookingsStatuses.length;j++){
				if($scope.bookingsStatuses[j].id == $scope.propertyBookings[i].bookingStatusId){
					$scope.testBookings[i].status = $scope.bookingsStatuses[j].name;
					break;
				}
			  }
		  }
		}
	},true);
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
	//Because of pagination was forced to move all filtering logic to controllers
    $scope.$watch('showOnlyStatus',function(){
    	$scope.currentPage = 1;
		$scope.filteredBookings = $filter('filter')($scope.propertyBookings,$scope.showOnlyStatus);
		$scope.filteredBookings = $filter('sortByYearBooking')($scope.filteredBookings,$scope.showOnlyYear);
		$scope.filteredBookings = $filter('sortByCheckInBooking')($scope.filteredBookings,$scope.showOnlyCheckInYear);
    });
    $scope.$watch('showOnlyYear',function(){
    	$scope.currentPage = 1;
		$scope.filteredBookings = $filter('filter')($scope.propertyBookings,$scope.showOnlyStatus);
		$scope.filteredBookings = $filter('sortByYearBooking')($scope.filteredBookings,$scope.showOnlyYear);
		$scope.filteredBookings = $filter('sortByCheckInBooking')($scope.filteredBookings,$scope.showOnlyCheckInYear);
    });
    $scope.$watch('showOnlyCheckInYear',function(){
    	$scope.currentPage = 1;
		$scope.filteredBookings = $filter('filter')($scope.propertyBookings,$scope.showOnlyStatus);
		$scope.filteredBookings = $filter('sortByYearBooking')($scope.filteredBookings,$scope.showOnlyYear);
		$scope.filteredBookings = $filter('sortByCheckInBooking')($scope.filteredBookings,$scope.showOnlyCheckInYear);
    });
    
    $scope.reverse = true;
    $scope.predicate = 'bookingId';
	$scope.bookedDateSort = 'noSort';
	$scope.checkInSort = 'noSort';
	$scope.reset = function(){
		$scope.bookedDateSort = 'noSort';
		$scope.checkInSort = 'noSort';
	};
    $scope.sortByCreationDate = function(){
    	$scope.predicate = 'bookedDate';
    	$scope.reverse = !$scope.reverse;
    	$scope.reset();
    	if(!$scope.reverse){
    		$scope.bookedDateSort = 'sort';
    	}else{
    		$scope.bookedDateSort = 'reverseSort';
    	}
    };
    $scope.sortByCheckIn = function(){
    	$scope.predicate = 'checkIn';
    	$scope.reverse = !$scope.reverse;
    	$scope.reset();
    	if(!$scope.reverse){
    		$scope.checkInSort = 'sort';
    	}else{
    		$scope.checkInSort = 'reverseSort';
    	}
    };
    
}]);;var myPropertyStatistics = angular.module("myPropertyStatistics",[]);
myPropertyStatistics.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showMyProperties.detail.statistics",{
		url:"/statistics",
		templateUrl:"modules/myProperties/partials/statistics.html",
		controller:"ShowMyPropertyStatisticsCtrl",
        data : {
        	authorities:['ROLE_USER']
        }
	});
}]);
myPropertyStatistics.controller("ShowMyPropertyStatisticsCtrl",["$scope", "PropertyService","BookingService","$stateParams", function($scope, PropertyService,BookingService,$stateParams){
	$scope.bookedDaysYear = moment().year();
	$scope.avgGuestCountYear = moment().year();
	$scope.avgStarsYear = moment().year();
	$scope.avgBookingsLengthYear = moment().year();
	
	$scope.showPropertyBookedDays = function(selectedYear){
		$scope.propertyBookedDays = new BookingService.propertyBookedDays.query({id:$stateParams.propertyId,year:selectedYear},function(){
			var dataToShow = [];
			for(var i=0;i<$scope.propertyBookedDays.length;i++){
				var month = moment([$scope.bookedDaysYear,$scope.propertyBookedDays[i].month-1]).format("MMMM YYYY");
				dataToShow.push([month,$scope.propertyBookedDays[i].bookedDays]);
			}
			$scope.chartConfigBookedDays = {
				options:{
					title:{
						text:"Amount of booked days by months"
					}
				},
				series:[],
				xAxis:{
					title:{text:"Months"},
					categories:[]
				}
			};
			$scope.chartConfigBookedDays.series.push({name:"Booked days",data:dataToShow});
			$scope.showChart = true;
		});
	};
	
	$scope.showPropertyAvgGuestCount = function(selectedYear){
		$scope.propertyAvgGuestCount = new BookingService.propertyAvgBookingGuestCount.query({id:$stateParams.propertyId,year:selectedYear},function(){
			var dataToShow = [];
			for(var i=0;i<$scope.propertyAvgGuestCount.length;i++){
				var month = moment([$scope.avgGuestCountYear,$scope.propertyAvgGuestCount[i].month-1]).format("MMMM YYYY");
				dataToShow.push([month,$scope.propertyAvgGuestCount[i].averageGuestCount]);
			}
			$scope.chartConfigAvgGuestCount = {
				options:{
					title:{
						text:"Average guest count by months"
					}
				},
				series:[],
				xAxis:{
					title:{text:"Months"},
					categories:[]
				}
			};
			$scope.chartConfigAvgGuestCount.series.push({name:"Average guest count",data:dataToShow});
		});
	};

	$scope.showPropertyAvgStars = function(selectedYear){
		$scope.propertyAvgStars = new BookingService.propertyAvgStars.query({id:$stateParams.propertyId,year:selectedYear},function(){
			var dataToShow = [];
			for(var i=0;i<$scope.propertyAvgStars.length;i++){
				var month = moment([$scope.avgStarsYear,$scope.propertyAvgStars[i].month-1]).format("MMMM YYYY");
				dataToShow.push([month,$scope.propertyAvgStars[i].averageStars]);
			}
			$scope.chartConfigAvgStars = {
				options:{
					title:{
						text:"Property average rating by months"
					}
				},
				series:[],
				xAxis:{
					title:{text:"Months"},
					categories:[]
				}
			};
			$scope.chartConfigAvgStars.series.push({name:"Property average rating",data:dataToShow});
		});
	};
	

	$scope.showBookingsAvgLength = function(selectedYear){
		$scope.bookingsAvgLength = new BookingService.propertyAvgBookingLength.query({id:$stateParams.propertyId,year:selectedYear},function(){
			var bookingAvgLength = [];
			var bookingCount = [];
			for(var i=0;i<$scope.bookingsAvgLength[0].bookingAvgLengthByMonth.length;i++){
				var month = moment([$scope.avgBookingsLengthYear,$scope.bookingsAvgLength[0].bookingAvgLengthByMonth[i].month-1,10]).valueOf();
				bookingAvgLength.push([month,$scope.bookingsAvgLength[0].bookingAvgLengthByMonth[i].averageLength]);
				bookingCount.push([month,$scope.bookingsAvgLength[0].bookingCountByMonth[i].bookingCount]);
			}
			$scope.chartConfigAvgBookingLength = {
				series:[],
				options: {
		            chart: {
		                zoomType: 'x'
		            },
		            rangeSelector: {
		                enabled: false
		            },
		            navigator: {
		                enabled: false
		            }
		        },
		        xAxis: {
		        	title:{text:"Months"},
		            type:"datetime",
		            dateTimeLabelFormats:{
		              month: '%b %Y'
		            }
		          },
				title:{
					text:"Average bookings length and number of bookings by months"
				},
				useHighStocks:true
			};
			$scope.chartConfigAvgBookingLength.series.push(
				{id:1,name:"Booking avg length",data:bookingAvgLength,dataGrouping:{approximation: "sum",
                    enabled: true,
                    forced: true,
                    units: [['month',[1]]]}},
				{id:2,name:"Booking count",data:bookingCount,dataGrouping:{approximation: "sum",
                    enabled: true,
                    forced: true,
                    units: [['month',[1]]]}}
			);
		});
	};
	$scope.showPropertyBookedDays($scope.bookedDaysYear);
	$scope.showPropertyAvgGuestCount($scope.avgGuestCountYear);
	$scope.showPropertyAvgStars($scope.avgStarsYear);
	$scope.showBookingsAvgLength($scope.avgBookingsLengthYear);
}]);;var myPropUnDates = angular.module("myPropertyUnavailableDates",[]);
myPropUnDates.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showMyProperties.detail.unDates",{
		url:"/unavailableDates",
		templateUrl:"modules/myProperties/partials/unavailableDates.html",
		controller:"UnavailableDatesCtrl",
        data : {
        	authorities:['ROLE_USER']
        }
	});
}]);
myPropUnDates.controller("UnavailableDatesCtrl",["$scope","PropertyService","BookingService","$stateParams",function($scope,PropertyService,BookingService,$stateParams){
	//unavailable dates:
	$scope.currentUnDates;
	$scope.currentBookedDates;
	$scope.datesUpdated = true;
	//to prevent from $scope.datesUpdated = false; and $apply (digest in progress error)
	var firstTime;
	firstTime = true;
	$scope.datesUpdated = true;
	$scope.currentUnDates = new BookingService.onlyUnavailableDays.query({id:$stateParams.propertyId});
	$scope.currentBookedDates = new BookingService.onlyBookedDays.query({id:$stateParams.propertyId});
	$scope.newUnDates;
	$scope.updateUnDates = function(dates){
		//it's executed once on datepicker startup
		if(!firstTime){
			$scope.newUnDates = dates;
			$scope.datesUpdated = false;
			//should update!
			$scope.$apply();
		}else{
			firstTime = false;
		}
	};
	$scope.sendUnDates = function(){
		BookingService.onlyUnavailableDays.update({id:$stateParams.propertyId},$scope.newUnDates,function(){
			$scope.datesUpdated = true;
		});
	};
}]);;var updateProperty = angular.module("updateProperty",[]);
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
	$scope.propertyFacilities = PropertyService.propertyFacilities.query();
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
	$scope.$watch('marker',function(){
		if(!angular.isUndefined($scope.marker)){
			$scope.property.latitude = $scope.marker.coords.latitude;
			$scope.property.longitude = $scope.marker.coords.longitude;
		}
	},true);
	
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
			
			$scope.marker.coords.latitude = newVal.geometry.location.A;
			$scope.marker.coords.longitude = newVal.geometry.location.F;
			$scope.map.center.latitude = newVal.geometry.location.A;
			$scope.map.center.longitude = newVal.geometry.location.F;
			$scope.map.zoom = 16;
			$scope.property.latitude = newVal.geometry.location.A;
			$scope.property.longitude = newVal.geometry.location.F;
		}
	});
	$scope.resetQuery = function(){
		$scope.property.address = "";
	};
	$scope.removePhoto = function(photo){
		var index = $scope.photosToUpload.indexOf(photo);
		if(index > -1){
			$scope.photosToUpload.splice(index, 1);
			$scope.photosBackup.push(photo);
		}
	};
	$scope.restorePhoto = function(photo){
		var index = $scope.photosBackup.indexOf(photo);
		if(index > -1){
			$scope.photosBackup.splice(index, 1);
			$scope.photosToUpload.push(photo);
		}
	};

	$scope.updateProperty = function(){
		//some bug that spring mvc refuses to save object with added property facility (400 (Bad Request))
		for(var i=0;i<$scope.property.propertyFacilities.length;i++){
			delete $scope.property.propertyFacilities[i]["atpropertyFacilityId"];
		}
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
		console.log($scope.property.latitude);
		if($scope.photosToUpload && $scope.photosToUpload.length){
			$scope.property.imagePaths = [];
			//$scope.property.imagePaths = $scope.photosToUpload;
			for (var i = 0; i < $scope.photosToUpload.length; i++) {
				if(typeof $scope.photosToUpload[i].path === 'undefined'){
					$scope.uploadingPhotos = true;
					uploadPhoto($scope.photosToUpload[i]);
				}else{
					$scope.property.imagePaths.push($scope.photosToUpload[i]);
				}
            }
			if(!$scope.uploadingPhotos){
				$scope.property.$update({id:$scope.property.id},function(data){
					$state.go("showProperty",{
						propertyId:$scope.property.id
					});
				});
			}
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
            //only when the last photo was uploaded
            if($scope.property.imagePaths.length == $scope.photosToUpload.length){
				$scope.property.$update({id:$scope.property.id},function(data){
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
}]);;var searchProperties = angular.module("searchProperties",[]);
searchProperties.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("queryProperties",{
		url:"/queryProperties/:address/:country/:city/:admArea/:checkIn/:checkOut/:guestNumber",
		views: {
			"mainView":{
				templateUrl:"modules/searchProperties/partials/searchProperties.html",
				controller:"SearchPropertiesCtrl"
			}
		},
		params:{
			checkIn:"",
			checkOut:"",
			guestNumber:""
		},
        data : {
            	authorities:[],
            	pageTitle:"Find properties"
        }
	});
}]);
searchProperties.controller("SearchPropertiesCtrl",["$scope", "PropertyService", "$stateParams", "$location","$filter", function($scope, PropertyService, $stateParams, $location,$filter){
	$scope.propertyFacilities = PropertyService.propertyFacilities.query();
	$scope.propertyTypes = PropertyService.propertyTypes.query();
	$scope.pricePerNightOptions = [
		{id:1,
			lowerBound:0,
			upperBound:50
		},{id:2,
			lowerBound:50,
			upperBound:100
		},{id:3,
			lowerBound:100,
			upperBound:150
		},{id:4,
			lowerBound:150,
			upperBound:200
		},{id:5,
			lowerBound:250,
		},
	];
	$scope.sorting = {propertyFacilities:[],propertyTypes:[],prices:[]};
	//for callendar
	//if no check in/check out specified, then undefined and no weird 01/01/0001 on calendar
	var checkInTemp = undefined;
	var checkOutTemp = undefined;
	if($stateParams.checkIn != "" || $stateParams.checkOut != ""){
		checkInTemp = moment($stateParams.checkIn,'DD/MM/YYYY')._d;
		checkOutTemp = moment($stateParams.checkOut,'DD/MM/YYYY')._d;
	}
	$scope.beforeRender = function($view, $dates, $leftDate, $upDate, $rightDate){
		for(var i=0;i<$dates.length;i++){
			var compare = moment($dates[i].utcDateValue);
			if(moment().diff(compare,'days') > 0){
				$dates[i].selectable = false;
			}
		}
	};
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
	$scope.query = {
			address:$stateParams.address,
			country:$stateParams.country,
			city:$stateParams.city,
			administrativeArea:$stateParams.admArea,
			checkIn:checkInTemp,
			checkOut:checkOutTemp,
			guestNumber:parseInt($stateParams.guestNumber)
	};
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
}]);;var login = angular.module("login",[]);
login.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("login",{
		url:"/login",
		views:{
			"mainView":{
				templateUrl:"modules/security/partials/login.html",
				controller:"LoginCtrl"
			}
		},
        data : {
            	authorities:[],
            	pageTitle:"Login"
        }
	})
	.state("accessDenied",{
        url : "/accessDenied",
        views:{
			"mainView":{
				templateUrl: "modules/security/partials/accessDenied.html"
			}
		},
        data : {
        	authorities:[],
        	pageTitle:"Access denied"
        }
   });
}]);
login.controller("LoginCtrl",["$scope","AccountService","$state","$rootScope", function($scope,AccountService,$state,$rootScope){
	$scope.login = function(){
		AccountService.login($scope.userAccount).then(function(){
			if($scope.returnToState){
				$state.go($scope.returnToState.name, $scope.returnToStateParams);
			}else{
				$state.go("home");
			}
		},function(){
			$scope.errorLogIn = true;
		});
	};
}]);;var logout = angular.module("logout",[]);
logout.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("logout",{
		url:"/logout",
		views:{
			"mainView":{
				controller:"LogoutCtrl"
			}
		},
        data : {
            authorities:['ROLE_USER']
        }
	});
}]);
logout.controller('LogoutCtrl', ["$scope","AccountService","$state","$rootScope",function($scope,AccountService,$state,$rootScope){
    $scope.service = new AccountService.logout();
}]);;var register = angular.module("register",[]);
register.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("register",{
		url:"/register",
		views:{
			"mainView":{
				templateUrl:"modules/security/partials/register.html",
				controller:"RegisterCtrl"
			}
		},
        data : {
            	authorities:[],
            	pageTitle:"Register"
        }
	});
}]);
register.controller("RegisterCtrl",["$scope","AccountService","$state",function($scope,AccountService,$state){
	$scope.userAccount = new AccountService.account;
	$scope.register = function(){
		var password = $scope.userAccount.password;
		$scope.userAccount.$save(function(returneData){
			$scope.userAccount.password = password;
			AccountService.login($scope.userAccount).then(function(data){
				$state.go("home");
			});
		});
	};
	$scope.checkUsername = function(formObject){
		AccountService.account.findByUsername({username:$scope.userAccount.username},function(){
			//user doesn't exist
			formObject.username.$setValidity("usernameAvailable",true);
		},function(){
			//user already exists
			formObject.username.$setValidity("usernameAvailable",false);
		});
	};
	
}]);;var showProperty = angular.module("showProperty",[]);
showProperty.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showProperty",{
		url:"/showProperty/{propertyId}/{checkIn}/{checkOut}/{guestNumber}",
		views:{
			"mainView":{
				templateUrl:"modules/showProperty/partials/showProperty.html",
				controller:"ShowPropertyCtrl"
			}
		},
		params:{
			checkIn:"",
			checkOut:"",
			guestNumber:""
		},
        data : {
            authorities:[],
            pageTitle:"Show property"
        }
	});
}]);
showProperty.controller("ShowPropertyCtrl", ["$scope","PropertyService","$resource","$stateParams","BookingService","$state",function($scope,PropertyService,$resource,$stateParams,BookingService,$state){
	$scope.currentUser = localStorage.getItem('currentUsername');
	$scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 16 };
	$scope.mapOptions = {scrollwheel: false};
	var checkInTemp = undefined;
	var checkOutTemp = undefined;
	if($stateParams.checkIn != "" || $stateParams.checkOut != ""){
		checkInTemp = moment($stateParams.checkIn,'DD/MM/YYYY')._d;
		checkOutTemp = moment($stateParams.checkOut,'DD/MM/YYYY')._d;
	}
	$scope.unavailableDatesBetween = false;
	$scope.booking = new BookingService.booking;
	$scope.booking.checkIn = checkInTemp;
	$scope.booking.checkOut = checkOutTemp;
	$scope.booking.guestNumber = parseInt($stateParams.guestNumber);
	$scope.booking.userAccount = {username:$scope.currentUser};
	$scope.booking.property = {id:$stateParams.propertyId};
	
	$scope.newReview = {};
	$scope.comment = {};
	$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId});
	$scope.stars = [1,2,3,4,5];
	$scope.canSendReviews = new PropertyService.reviews.canSendReviews({propertyId:$stateParams.propertyId});
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
			if(typeof $scope.newReview.stars !== 'undefined'){
				PropertyService.reviews.save({id:$stateParams.propertyId},$scope.newReview,function(data){
					$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId});
					$scope.newReview = {};
					formObject.$setPristine();
					$scope.starsRequired = false;
				});
			}else{
				$scope.starsRequired = true;
			}
		}else{
			$scope.comment.parentReviewId = parentReviewId;
			PropertyService.reviews.save({id:$stateParams.propertyId},$scope.comment,function(data){
				$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId});
				$scope.comment = {};
				$scope.reviewToComment = 0;
				formObject.$setPristine();
			});
		}
	};
	
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
	};
	$scope.nextImg = function(){
		if($scope.currentIndx == $scope.property.imagePaths.length - 1){
			$scope.setImg($scope.property.imagePaths[0]);
		}else{
			$scope.setImg($scope.property.imagePaths[$scope.currentIndx+1]);
		}
	};
	$scope.prevImg = function(){
		if($scope.currentIndx == 0){
			$scope.setImg($scope.property.imagePaths[$scope.property.imagePaths.length-1]);
		}else{
			$scope.setImg($scope.property.imagePaths[$scope.currentIndx-1]);
		}
	};
	$scope.unavailableDates = new BookingService.unavailableDates.query({id:$stateParams.propertyId});
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
		}
	};
	$scope.bookApartment = function(){
		//part of validation moved here
		var thereAreErrors = false;
		if(!angular.isUndefined($scope.booking.checkOut) && !angular.isUndefined($scope.booking.checkIn)){
		   var startDate = moment($scope.booking.checkIn);
		   var endDate = moment($scope.booking.checkOut);
		   var difference = endDate.diff(startDate,'days');
		   if(difference >= $scope.property.minimumNights){
				for(var i=0;i<$scope.unavailableDates.length;i++){
					var start = moment($scope.unavailableDates[i].startDate);
					var end = moment($scope.unavailableDates[i].endDate);
					if(start.isBetween($scope.booking.checkIn,$scope.booking.checkOut) || end.isBetween($scope.booking.checkIn,$scope.booking.checkOut)){
						thereAreErrors = true;
					}
		    	}
		   }else{
			   //too few days booked!
				thereAreErrors = true;
		   }
		}
		if(!thereAreErrors){
			$scope.booking.$save();
			$state.go("showMyBookings");
		}else{
			$scope.bookingForm.checkIn.$setValidity("validcheckIn", false);
			$scope.bookingForm.checkOut.$setValidity("validcheckOut", false);
		}
	};
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
	
}]);;var propertyDirective = angular.module("BookingDatesDirective", []);

propertyDirective.directive('checkDatesMatch', function () {
    var isValid = function(name,date1,date2) {
		if(typeof date1 === 'undefined' || typeof date2 === 'undefined')
			return true;
    	var checkIn;
    	var checkOut;
    	if(name == "checkIn"){
    		checkIn = moment(date1,"DD/MM/YYYY");
    		checkOut = moment(date2);
    	}else{
    		checkIn = moment(date2);
    		checkOut = moment(date1,"DD/MM/YYYY");
    	}
    	if(checkIn.isAfter(checkOut)){
    		return false;
    	}
    	return true;
    };
    var isNotUnavailable = function(date,unavailableDates) {
    	if(!angular.isUndefined(unavailableDates)){
	    	var compare = moment(date,"DD/MM/YYYY");
	    	for(var j=0;j<unavailableDates.length;j++){
				var start = moment(unavailableDates[j].startDate);
				var end = moment(unavailableDates[j].endDate);
				if(compare.isBetween(start,end,'day') || compare.isSame(start,'day') || compare.isSame(end,'day')){
					return false;
				}
				if(compare.isBefore(moment(),'day') || compare.isSame(moment(),'day')){
					return false;
				}
			}
			return true;
    	}else{
    		return true;
    	}
    };
    return {
        require:'ngModel',
        scope:{
        	unavailableDates : "=checkDate"
        },
        link:function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.unshift(function (viewValue) {
            	//observe other input (they are in pairs)
            	//if other input changes(passed value to this directive changes, eg query.checkIn), we should check it (in observe)
            	//after that we check current input
            	//in a criss-cross manner validation 
            	//it seems that checkDatesMatch - reference to another input lol
            	attrs.$observe('checkDatesMatch',function(actualValue){
            		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,viewValue,scope.$eval(actualValue)));
            	});
            	//if no watch and it doesn't have true, unavailableDates will be undefined.
            	scope.$watch('unavailableDates',function(){
            		var result = isNotUnavailable(viewValue,scope.unavailableDates);
            		var finalResult = result && isValid(attrs.name,viewValue,scope.$eval(attrs.checkDatesMatch));
            		ngModelCtrl.$setValidity('valid'+attrs.name, finalResult);
            	},true);//very important http://stackoverflow.com/questions/11135864/scope-watch-is-not-updating-value-fetched-from-resource-on-custom-directive
        		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,viewValue,scope.$eval(attrs.checkDatesMatch)));
        		return viewValue;
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	//it is for checking whether the variable is passed to directive or not
            	//http://stackoverflow.com/questions/16232917/angularjs-how-to-pass-scope-variables-to-a-directive
            	attrs.$observe('checkDatesMatch',function(actualValue){
            		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,modelValue,scope.$eval(actualValue)));
            	});
            	scope.$watch('unavailableDates',function(){
            		var result = isNotUnavailable(modelValue,scope.unavailableDates);
            		var finalResult = result && isValid(attrs.name,modelValue,scope.$eval(attrs.checkDatesMatch));
            		ngModelCtrl.$setValidity('valid'+attrs.name, finalResult);
            	},true);
        		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,modelValue,scope.$eval(attrs.checkDatesMatch)));
            	return modelValue;
            });
        }
    };
});
//alternative to $scope.$watch solution
propertyDirective.directive('filterDate',["$filter", function($filter){
	return {
		require:'ngModel',
		link: function(scope,element,attrs,modelCtrl){
			//convert data from model format to view format
			modelCtrl.$formatters.push(function(inputValue){
				if(typeof inputValue !== 'undefined'){
					var transformedInput = $filter("date")(inputValue,'dd/MM/yyyy');
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
					return transformedInput;
				}
			});
			//convert data from view format to model format
			modelCtrl.$parsers.push(function(data){
				return moment(data,"DD/MM/YYYY")._d;
			});
		}
	};
}]);
propertyDirective.directive('countBookingPrice',function(){
	return{
		scope:{
			checkIn:"=",
			checkOut:"=",
			nightPrice:"="
		},
		templateUrl:"shared/directives/partials/bookingPrice.html",
		link:function(scope,element,attr){
			scope.$watch("checkIn",function(newVal){
				if(typeof scope.checkIn !== 'undefined' && typeof scope.checkOut !== 'undefined'){
					   var startDate = moment(scope.checkIn);
					   var endDate = moment(scope.checkOut);
					   var difference = endDate.diff(startDate,'days');
					   var result = difference*scope.nightPrice;
					   if(result > 0){
						   scope.totalPrice = difference*scope.nightPrice;
						   scope.nightCount = difference;
					   }else{
						   delete scope.totalPrice;
						   delete scope.nightCount;
					   }
				}
			});
			scope.$watch("checkOut",function(newVal){
				if(typeof scope.checkIn !== 'undefined' && typeof scope.checkOut !== 'undefined'){
					   var startDate = moment(scope.checkIn);
					   var endDate = moment(scope.checkOut);
					   var difference = endDate.diff(startDate,'days');
					   var result = difference*scope.nightPrice;
					   if(result > 0){
						   scope.totalPrice = difference*scope.nightPrice;
						   scope.nightCount = difference;
					   }else{
						   delete scope.totalPrice;
						   delete scope.nightCount;
					   }
				}
			});
		}
	};
});;var propertyDirective = angular.module("BookingStatusDirective", []);
propertyDirective.directive("showBookingStatus",function(){
	return{
		restrict:"E",
		scope:{
			list:"=",
			currentStatusId:"="
		},
		templateUrl:"shared/directives/partials/showBookingStatus.html",
		link:function(scope){
			scope.$watch('currentStatusId',function(){
				angular.forEach(scope.list,function(value){
					if(value.id == scope.currentStatusId){
						scope.bookingStatus = value.name;
						scope.bookingStatusDesc = value.description;
					}
				});
			});
		}
	}
});;var propertyDirective = angular.module("CheckListDirective", []);
propertyDirective.directive('checkList',["$parse",function($parse){
	return{
		restrict:'A',
		scope:{
			list:'=checkList',
			value:'@'
		},
		link:function(scope,elem,attrs){
			var handler = function(setup){
				if(typeof scope.list != 'undefined'){
					var checked = elem.prop('checked');
					var index = scope.list.map(function(o) { return o.id; }).indexOf(scope.$eval(scope.value).id);
					if (checked && index == -1) {
				          if (setup) elem.prop('checked', false);
				          else scope.list.push(scope.$eval(scope.value));
				        } else if (!checked && index != -1) {
				          if (setup) elem.prop('checked', true);
				          else scope.list.splice(index, 1);
				    }
				}
			};
			//if there are any data on startup setupHandler takes it 
			var setupHandler = handler.bind(null,true);
			var changeHandler = handler.bind(null,false);
			elem.bind('change', function(){
				scope.$apply(changeHandler);
			});
			scope.$watch('list', setupHandler, true);
		}
	};
}]);;var propertyDirective = angular.module("DatepickerDirective", []);
propertyDirective.directive("myDatepicker",function(){
	return {
		restrict:"E",
		scope:{
			unavailableDates:"=",
			bookedDates:"=",
			updateUnDates:"&"
		},
		templateUrl:"shared/directives/partials/datepicker.html",
		link : function(scope){
			scope.$watchGroup(['unavailableDates','bookedDates'],function(newValues){
				var bookedDates = [];
				for (var i = 0; i < newValues[1].length; i++) {
					var start = moment(newValues[1][i].startDate);
					var end = moment(newValues[1][i].endDate);
					while(start.isBefore(end,'day') || start.isSame(end,'day')){
						bookedDates.push(start.format("DD/MM/YYYY"));
						start.add(1,'day');
					}
				}
				var unavailableDates = [];
				for(var i=0;i<newValues[0].length;i++){
					unavailableDates.push(new Date(newValues[0][i].when));
				}
				$('.datepicker').datepicker({
					orientation:"top auto",
				    startDate: '0d',
				    datesDisabled:bookedDates
				})
				.on("changeDate",function(e){
					scope.updateUnDates({dates:e.dates});
					$("#datepicker_data_input").val(
						$(".datepicker").datepicker("getFormattedDate")	
					);
				});
				$('.datepicker').datepicker("setDates",unavailableDates);
			});
		}
	};
});;var propertyDirective = angular.module("GroupBookingsByDateDirective", []);
propertyDirective.directive("groupBookingsByDate",["$filter",function($filter){
	return {
		restrict:"E",
		scope:{
			bookings:"=",
			currentBooking:"=",
			startFrom:"=",
			limitTo:"=",
			orderBy:"@"
		},
		templateUrl:"shared/directives/partials/groupBookingsByDate.html",
		link : function(scope){
			scope.bookings = $filter('startFrom')(scope.bookings,scope.startFrom);
			scope.bookings = $filter('limitTo')(scope.bookings,scope.limitTo);
			scope.bookings = $filter('orderBy')(scope.bookings,scope.orderBy);
			for(var i=0;i<scope.bookings.length;i++){
				if(scope.bookings[i].checkIn == scope.currentBooking.checkIn){
					var showDate = true;
					var currentMoment = moment(scope.currentBooking.checkIn);
					for(var j=0;j<i;j++){
						var compareMoment = moment(scope.bookings[j].checkIn);
						if(currentMoment.isSame(compareMoment,'month')){
							showDate = false;
							break;
						}
					}
					if(showDate){
						scope.dateToShow = scope.currentBooking.checkIn;
						break;
					}
				}
			}
		}
	};
}]);;var propertyDirective = angular.module("ValidateQueryDirective", []);
//this directive is used to check whether user has chosen address from the list that is provided by google
//validates ng-model specified in input
//http://habrahabr.ru/post/167793/
//passing STRING of some object (usually giving country)
propertyDirective.directive('validateQuery', function () {
    var isValid = function(query) {
        if(query != '' && typeof query !== 'undefined'){
        	return true;
        }else{
        	return false;
        }
    };

    return {
        require:'ngModel',
        link:function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.unshift(function (viewValue) {
            	//this variant cuz we have {{}} in our attribute check-query="{{query}}"
            	attrs.$observe('validateQuery',function(actualValue){
            		//можно исопльзовать scope.query??
            		//scope.$eval to transform from string to javascript object
            		ngModelCtrl.$setValidity('validQuery', isValid(actualValue));
            	});
        		return viewValue;
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	attrs.$observe('validateQuery',function(actualValue){
            		ngModelCtrl.$setValidity('validQuery', isValid(actualValue));
            	});
            	return modelValue;
            });
        }
    };
});;
var propertyFilters = angular.module("SortingFilters", []);
propertyFilters.filter('sortByFacility', function(){
	return function(properties,facilities){
		if(!angular.isUndefined(properties) && facilities.length > 0){
			var result = [];
			var amountOfFacilitiesToFind = facilities.length;
			for(var i=0;i<properties.length;i++){
				var foundFacilities = 0;
				for(var j=0;j<facilities.length;j++){
					for(var k=0;k<properties[i].propertyFacilities.length;k++){
						if(properties[i].propertyFacilities[k].id == facilities[j].id){
							foundFacilities++;
							if(foundFacilities == amountOfFacilitiesToFind){
								break;
							}
						}
					}
					if(foundFacilities == amountOfFacilitiesToFind){
						break;
					}
				}
				if(foundFacilities == amountOfFacilitiesToFind){
					result.push(properties[i]);
				}
			}
			return result;
		}
		return properties;
	};
});
propertyFilters.filter('sortByType',function(){
	return function(properties,types){
		if(!angular.isUndefined(properties) && types.length > 0){
			var result = [];
			for(var i=0;i<properties.length;i++){
				var acceptable = false;
				for(var j=0;j<types.length;j++){
					if(properties[i].propertyType == types[j].name){
						acceptable = true;
						break;
					}
				}
				if(acceptable){
					result.push(properties[i]);
				}
			}
			return result;
		}
		return properties;
	};
});
propertyFilters.filter('sortByPrice',function(){
	return function(properties,prices){
		if(!angular.isUndefined(properties) && prices.length > 0){
			var result = [];
			for(var i=0;i<properties.length;i++){
				var acceptable = false;
				for(var j=0;j<prices.length;j++){
					if(properties[i].pricePerNight >= prices[j].lowerBound && 
							(typeof prices[j].upperBound === 'undefined' || 
									properties[i].pricePerNight <= prices[j].upperBound)){
						acceptable = true;
						break;
					}
				}
				if(acceptable){
					result.push(properties[i]);
				}
			}
			return result;
		}
		return properties;
	};
});
propertyFilters.filter('sortByYearBooking',function(){
	return function(bookings,year){
		if(!angular.isUndefined(bookings) && !angular.isUndefined(year) && year != ""){
			var result = [];
			for(var i=0;i<bookings.length;i++){
				var createdYear = moment(bookings[i].bookedDate).year();
				if(createdYear == year){
					result.push(bookings[i]);
				}
			}
			return result;
		}
		return bookings;
	}
});
propertyFilters.filter('sortByCheckInBooking',function(){
	return function(bookings,year){
		if(!angular.isUndefined(bookings) && !angular.isUndefined(year) && year != ""){
			var result = [];
			for(var i=0;i<bookings.length;i++){
				var checkInYear = moment(bookings[i].checkIn).year();
				if(checkInYear == year){
					result.push(bookings[i]);
				}
			}
			return result;
		}
		return bookings;
	}
});
propertyFilters.filter('startFrom',function(){
	return function (input, start) {
		if(!angular.isUndefined(input)){
			return input.slice(start);
		}
    };
});;
var propertyFilters = angular.module("TruncateFilter", []);
/**
 * Truncate filter. Truncate till first found space.
 * @Param text
 * @Param limit
 * @Param showMore
 * @return String
 */
propertyFilters.filter('truncate', function(){
	return function(text,limit,showMore){
		if(!angular.isUndefined(text)){
			//only if text is longer than
			if(showMore == "Show more" && text.length > limit){
				var regex = /\s/;
				for(var i=0;i<limit;i++){
					if(regex.exec(text[limit-i])){
						limit = limit - i;
						break;
					}
				}
				var result = text.slice(0, limit);
				result += "...";
				return result;
			}
			return text;
		}
	};
});;var propertyService = angular.module("AccountServiceModule", []);
propertyService.factory("AccountService",["$resource","API_URL","$http","$rootScope","$state","ConversationService","APP_URL",function($resource,API_URL,$http,$rootScope,$state,ConversationService,APP_URL){
	// /accounts POST - register
	// /accounts/:id GET - get account by id
	// /accounts GET + parameters username and password - get account by username and password
	var accountService = {
		account:$resource(API_URL+"accounts/:accountId",{},{
			findByUsername:{
				method:"GET",
				url:API_URL+"accounts/username/:username"
			}
		}),
		login:function(data) {
	        return $http.post(APP_URL+"login", "username=" + data.username +
	                "&password=" + data.password, {
	                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	                } ).then(function(data2) {
	                    //alert("login successful");
	                    localStorage.setItem("currentUsername", data.username);
	                    $rootScope.currentUsername = localStorage.getItem("currentUsername");
	                    localStorage.setItem("authority",data2.data.authority);
	                    //check if new msgs are available
	                    $rootScope.newMsgs = new ConversationService.conversation.query({});
	                });
	    },
		logout : function(){
			$http.post(APP_URL+"logout", {}).success(function() {
			    //alert("logout successful");
				localStorage.removeItem("currentUsername");
				localStorage.removeItem("authority");
				delete $rootScope.currentUsername;
				$state.go("home");
			  }).error(function(data) {
				localStorage.removeItem("currentUsername");
				localStorage.removeItem("authority");
				delete $rootScope.currentUsername;
				$state.go("home");
			  });
		}
	};
	return accountService;
}]);;var propertyService = angular.module("BookingServiceModule", []);
propertyService.factory("BookingService",["$resource","API_URL",function($resource,API_URL){
	var bookingService = {
		booking: $resource(API_URL+'bookings/:id',{},{
			myBookings:{
				method:"GET",
				isArray:true,
				url:API_URL+"bookings/myBookings"
			},
			myPropertiesBookings:{
				method:"GET",
				isArray:true,
				url:API_URL+"bookings/myPropertysBookings/:propertyId"
			},
			allMyPropertiesBookings:{
				method:"GET",
				isArray:true,
				url:API_URL+"bookings/myPropertiesBookings"
			}
		}),
		propertyBookedDays : $resource(API_URL+"bookings/bookedDaysStatistics/:id/:year",{}),
		propertyAvgBookingGuestCount : $resource(API_URL+"bookings/bookingAvgGuestCountStatistics/:id/:year",{}),
		propertyAvgStars : $resource(API_URL+"bookings/bookingAvgRatingStatistics/:id/:year",{}),
		propertyAvgBookingLength : $resource(API_URL+"bookings/bookingAvgLengthStatistics/:id/:year",{}),
		bookingsStatuses : $resource(API_URL+"bookings/bookingStatuses",{},{
			updateBookingStatus:{
				method:"GET",
				url:API_URL+"bookings/bookingStatus/:bookingId/:statusId"
			}
		}),
		unavailableDates : $resource(API_URL+'bookings/unavailableDates/:id', {}),
		onlyBookedDays : $resource(API_URL+"bookings/onlyBookedDates/:id"),
		onlyUnavailableDays : $resource(API_URL+"bookings/onlyUnavailableDates/:id",{},{
			update:{method:"PUT"}
		}),
	};
	return bookingService;
}]);;var propertyService = angular.module("ConversationServiceModule", []);
propertyService.factory("ConversationService",["$resource","API_URL",function($resource,API_URL){
	var conversationService = {
			conversation: $resource(API_URL+"messages/:bookingId",{},{
				markRead:{
					method:"GET",
					url:API_URL+"messages/markRead/:bookingId"
				}
			})
	};
	return conversationService;
}]);;var httpInterceptor = angular.module('HttpInterceptorService',[]);
//to intercept both 401 and 403 errors
httpInterceptor.factory('httpErrorResponseInterceptor', [ '$q', '$location', function($q, $location) {
	return {
		response : function(responseData) {
			return responseData;
		},
		responseError : function error(response) {
			switch (response.status) {
			case 401:
				localStorage.removeItem("currentUsername");
				localStorage.removeItem("authority");
				$location.path('/login');
				break;
			case 403:
				$location.path('/accessDenied');
				break;
			default:
				alert("Unknown error occured.");
			}
			return $q.reject(response);
		}
	};
}]);;var propertyService = angular.module("PropertyServiceModule", []);
propertyService.factory("PropertyService", [ "$resource", "API_URL", function($resource,API_URL) {
	//earlier was: {id : "@id"}
	var propertyService = {
		property: $resource(API_URL+'properties/:id', {}, {
				find:{
					method:"POST",
					isArray:true,
					url:API_URL+"properties/search"
				},
				findMyProperties:{
					method:"GET",
					isArray:true,
					url:API_URL+"properties/myProperties/:ownerId"
				},
				update:{method:"PUT"}
		}),
		propertyTypes: $resource(API_URL+'properties/propertyTypes', {}),
		propertyFacilities : $resource(API_URL+'properties/propertyFacilities',{}),
		reviews : $resource(API_URL+"properties/reviews/:id",{},{
			canSendReviews:{
				method:"GET",
				url:API_URL+"bookings/canSendReviews/:propertyId"
			}
		})
	};
	return propertyService;
}]);