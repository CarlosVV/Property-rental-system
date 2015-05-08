var myProperties = angular.module("myProperties",[]);
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
}]);