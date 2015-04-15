var propertyService = angular.module("BookingServiceModule", []);
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