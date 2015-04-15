var login = angular.module("login",[]);
login.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("login",{
		url:"/login",
		views:{
			"mainView":{
				templateUrl:"modules/security/partials/login.html",
				controller:"LoginCtrl"
			}
		},
        data : {
            	authorities:[],
            	pageTitle:"Login"
        }
	})
	.state("accessDenied",{
        url : "/accessDenied",
        views:{
			"mainView":{
				templateUrl: "modules/security/partials/accessDenied.html"
			}
		},
        data : {
        	authorities:[],
        	pageTitle:"Access denied"
        }
   });
}]);
login.controller("LoginCtrl",["$scope","AccountService","$state","$rootScope", function($scope,AccountService,$state,$rootScope){
	console.log($scope.returnToState);
	$scope.login = function(){
		console.log($scope.userAccount);
		AccountService.login($scope.userAccount).then(function(){
			//redirecting to set in app $on stateChange state
			console.log($scope.returnToState);
			if($scope.returnToState){
				console.log("ITS ON RIGHT WAY",$scope.returnToState);
				$state.go($scope.returnToState.name, $scope.returnToStateParams);
			}else{
				$state.go("home");
			}
		});
	};
}]);