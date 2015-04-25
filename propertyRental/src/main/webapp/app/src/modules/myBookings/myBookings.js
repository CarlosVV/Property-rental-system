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
myBookings.controller("ShowMyBookingsCtrl",["$scope","BookingService","$filter",function($scope,BookingService,$filter){
	$scope.currentPage = 1;
    $scope.itemsPerPage = 2;
    $scope.showOnlyStatus = "";
    $scope.showOnlyYear = "";
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
    });
    $scope.$watch('showOnlyYear',function(){
    	$scope.currentPage = 1;
		$scope.filteredBookings = $filter('sortByYearBooking')($scope.bookings,$scope.showOnlyYear);
		$scope.filteredBookings = $filter('filter')($scope.filteredBookings,$scope.showOnlyStatus);
    });
}]);