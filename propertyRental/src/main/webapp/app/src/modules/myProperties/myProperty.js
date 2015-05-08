var myProperty = angular.module("myProperty",[]);
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
}]);