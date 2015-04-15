var logout = angular.module("logout",[]);
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
}]);