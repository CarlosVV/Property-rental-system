var register = angular.module("register",[]);
register.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("register",{
		url:"/register",
		views:{
			"mainView":{
				templateUrl:"modules/security/partials/register.html",
				controller:"RegisterCtrl"
			}
		},
        data : {
            	authorities:[],
            	pageTitle:"Register"
        }
	});
}]);
register.controller("RegisterCtrl",["$scope","AccountService","$state",function($scope,AccountService,$state){
	$scope.userAccount = new AccountService.account;
	$scope.register = function(){
		var password = $scope.userAccount.password;
		console.log($scope.userAccount);
		$scope.userAccount.$save(function(returneData){
			$scope.userAccount.password = password;
			AccountService.login($scope.userAccount).then(function(data){
				console.log("WTF");
				console.log(data);
				$state.go("home");
			});
		});
	};
	$scope.checkUsername = function(formObject){
		console.log(formObject);
		AccountService.account.findByUsername({username:$scope.userAccount.username},function(){
			//user doesn't exist
			formObject.username.$setValidity("usernameAvailable",true);
		},function(){
			//user already exists
			console.log("ERR");
			formObject.username.$setValidity("usernameAvailable",false);
		});
	};
	
}]);