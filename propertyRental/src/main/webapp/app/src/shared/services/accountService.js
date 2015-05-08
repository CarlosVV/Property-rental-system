var propertyService = angular.module("AccountServiceModule", []);
propertyService.factory("AccountService",["$resource","API_URL","$http","$rootScope","$state","ConversationService","APP_URL",function($resource,API_URL,$http,$rootScope,$state,ConversationService,APP_URL){
	// /accounts POST - register
	// /accounts/:id GET - get account by id
	// /accounts GET + parameters username and password - get account by username and password
	var accountService = {
		account:$resource(API_URL+"accounts/:accountId",{},{
			findByUsername:{
				method:"GET",
				url:API_URL+"accounts/username/:username"
			}
		}),
		login:function(data) {
	        return $http.post(APP_URL+"login", "username=" + data.username +
	                "&password=" + data.password, {
	                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
	                } ).then(function(data2) {
	                    //alert("login successful");
	                    localStorage.setItem("currentUsername", data.username);
	                    $rootScope.currentUsername = localStorage.getItem("currentUsername");
	                    localStorage.setItem("authority",data2.data.authority);
	                    //check if new msgs are available
	                    $rootScope.newMsgs = new ConversationService.conversation.query({});
	                });
	    },
		logout : function(){
			$http.post(APP_URL+"logout", {}).success(function() {
			    //alert("logout successful");
				localStorage.removeItem("currentUsername");
				localStorage.removeItem("authority");
				delete $rootScope.currentUsername;
				$state.go("home");
			  }).error(function(data) {
				localStorage.removeItem("currentUsername");
				localStorage.removeItem("authority");
				delete $rootScope.currentUsername;
				$state.go("home");
			  });
		}
	};
	return accountService;
}]);