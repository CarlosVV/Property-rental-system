var myPropUnDates = angular.module("myPropertyUnavailableDates",[]);
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
myPropUnDates.controller("UnavailableDatesCtrl",["$scope","PropertyService","$stateParams",function($scope,PropertyService,$stateParams){
	//unavailable dates:
	$scope.currentUnDates;
	$scope.currentBookedDates;
	$scope.datesUpdated = true;
	//to prevent from $scope.datesUpdated = false; and $apply (digest in progress error)
	var firstTime;
	firstTime = true;
	$scope.datesUpdated = true;
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
		PropertyService.onlyUnavailableDays.update({id:$stateParams.propertyId},$scope.newUnDates,function(){
			console.log("UPdated");
			$scope.datesUpdated = true;
		});
	};
}]);