/**
 * 
 */

/**
 * 
 */
var rentalApp = angular.module('RentalApp',
	[
	 'ui.router',
	 'ngResource',
	 'uiGmapgoogle-maps',
	 'ngAutocomplete',
	 'ui.bootstrap.datetimepicker',
	 'angularFileUpload',
	 'highcharts-ng',
	 'ui.bootstrap',
	 'home',
	 'addProperty',
	 'login',
	 'register',
	 'logout',
	 'searchProperties',
	 'myBookings',
	 'showProperty',
	 'conversations',
	 'chat',
	 'myProperties',
	 'myProperty',
	 'myPropertyStatistics',
	 'updateProperty',
	 'myPropertyBookings',
	 'myPropertyUnavailableDates',
	 'PropertyServiceModule',
	 'BookingServiceModule',
	 'ConversationServiceModule',
	 'AccountServiceModule',
	 'BookingDatesDirective',
	 'DatepickerDirective',
	 'BookingStatusDirective',
	 'CheckListDirective',
	 'ValidateQueryDirective',
	 'GroupBookingsByDateDirective',
	 'SortingFilters',
	 'TruncateFilter',
	 'HttpInterceptorService'
	 ]
);

rentalApp.constant('API_URL',"/propertyRental/api/");
rentalApp.constant('APP_URL',"/propertyRental/");

rentalApp.config(["$stateProvider","$urlRouterProvider",'$httpProvider', function($stateProvider,$urlRouterProvider,$httpProvider){
		$urlRouterProvider.otherwise("/");
		$httpProvider.interceptors.push('httpErrorResponseInterceptor');
}]);

rentalApp.run(["$rootScope","$state","ConversationService","$interval",function($rootScope, $state,ConversationService,$interval){
	$rootScope.isLoggedIn = function(){
		var result = localStorage.getItem("currentUsername") !== null;
		return result;
	};
	$rootScope.getAuthority = function(){
		return localStorage.getItem("authority");
	};
	$rootScope.currentUsername = localStorage.getItem("currentUsername");
	//although it's checked on login but when user hard refeshs page it should check anyway
	if($rootScope.isLoggedIn()){
		$rootScope.newMsgs = new ConversationService.conversation.query({},function(){
			console.log("OKAY WE GOT",$rootScope.newMsgs);
			if($rootScope.newMsgs.length){
				$rootScope.$broadcast("newMessages");
			}
		});
	}
	//checking messages every 10 sec
	var checkNewMsgs = $interval(function(){
		if($rootScope.isLoggedIn()){
			$rootScope.newMsgs = new ConversationService.conversation.query({},function(){
				console.log("OKAY WE GOT",$rootScope.newMsgs);
				if($rootScope.newMsgs.length){
					$rootScope.$broadcast("newMessages");
				}
			});
		}
	},5000);
	//to redirect to right page after login
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams){
        $rootScope.pageTitle = toState.data.pageTitle + " - Property rental system";
        console.log("WORKS?");
        if(toState.data.authorities.length != 0){
	        if($rootScope.isLoggedIn() && toState.data.authorities.indexOf($rootScope.getAuthority()) == -1){
	            event.preventDefault();
	        	$state.go('accessDenied');
	        }else if(!$rootScope.isLoggedIn()){
		            $rootScope.returnToState = toState;
		            $rootScope.returnToStateParams = toStateParams;
		            event.preventDefault();
		            $state.go('login');
	        }
        }
    });
}]);
