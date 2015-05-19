/**
 * My property booking list module.
 */
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
    
}]);