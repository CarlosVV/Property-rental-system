/**
 * 
 */
var propertyService = angular.module("PropertyService", []);
propertyService.factory("PropertyService", [ "$resource", "API_URL", function($resource,API_URL) {
	//earlier was: {id : "@id"}
	var propertyService = {
		property: $resource(API_URL+'properties/:id', {}, {
				find:{
					method:"POST",
					isArray:true,//API_URL+"apartments/search/:country/:city/:admArea/:checkIn/:checkOut"
					url:API_URL+"properties/search"/*,
					params:{
						country:"@country",
						city:"@locality",
						admArea:"@administrative_area_level_1",
						checkIn:"@checkIn",
						checkOut:"@checkOut"
					}*/
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
		unavailableDates : $resource(API_URL+'properties/unavailableDates/:id', {}),
		onlyBookedDays : $resource(API_URL+"properties/onlyBookedDates/:id"),
		onlyUnavailableDays : $resource(API_URL+"properties/onlyUnavailableDates/:id",{},{
			update:{method:"PUT"}
		}),
		reviews : $resource(API_URL+"properties/reviews/:id",{},{
			canSendReviews:{
				method:"GET",
				url:API_URL+"bookings/canSendReviews/:propertyId"
			}
		})
	};
	return propertyService;
}]);
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
		})
	};
	return bookingService;
}]);
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
}]);
/*propertyService.factory("SessionService",["$resource","API_URL",function($resource,API_URL){
	var sessionService = {
		
	};
	return sessionService;
}]);*/
propertyService.factory("AccountService",["$resource","API_URL","$http","$rootScope","$state","ConversationService",function($resource,API_URL,$http,$rootScope,$state,ConversationService){
	// /accounts POST - register
	// /accounts/:id GET - get account by id
	// /accounts GET + parameters username and password - get account by username and password
	var accountService = {
		account:$resource(API_URL+"accounts/:accountId"),
		login:function(data) {
	        return $http.post(API_URL+"login", "username=" + data.username +
	                "&password=" + data.password, {
	                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	                } ).then(function(data2) {
	                    //alert("login successful");
	                    localStorage.setItem("currentUsername", data.username);
	                    $rootScope.currentUsername = localStorage.getItem("currentUsername");
	                    localStorage.setItem("authority",data2.data.authority);
	                    //check if new msgs are available
	                    $rootScope.newMsgs = new ConversationService.conversation.query({});
	                    $state.go("login");
	                }, function(data2) {
	                    $state.go("login");
	                    alert("error logging in");
	                });
	    },
		logout : function(){
			console.log("logout");
			$http.post(API_URL+"logout", {}).success(function() {
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
}]);