var myPropertyBookings = angular.module("myPropertyBookings",[]);
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
myPropertyBookings.controller("ShowMyPropertyBookingsCtrl",["$scope", "PropertyService","BookingService","$stateParams", function($scope, PropertyService,BookingService,$stateParams){
	$scope.availableYears = [];
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
		}
	});
	$scope.bookingsStatuses = BookingService.bookingsStatuses.query();
	$scope.showOnlyStatus = {};
	$scope.$watch('showOnlyStatus',function(){
		console.log("PLS",$scope.showOnlyStatus);
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
}]);