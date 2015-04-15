var myBookings = angular.module("myBookings",[]);
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
myBookings.controller("ShowMyBookingsCtrl",["$scope","BookingService",function($scope,BookingService){
	$scope.availableYears = [];
	$scope.bookings = new BookingService.booking.myBookings(function(){
		for(var i=0;i<$scope.bookings.length;i++){
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
		}
	});
	$scope.bookingsStatuses = BookingService.bookingsStatuses.query();
	$scope.$watch('bookings',function(newVal){
		console.log($scope.bookings);
	});
	
}]);