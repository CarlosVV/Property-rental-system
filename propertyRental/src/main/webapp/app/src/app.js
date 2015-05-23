/**
 * Application root module
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
/**
 * A common part of all API URLs
 */
rentalApp.constant('API_URL',"/propertyRental/api/");
/**
 * Application url
 */
rentalApp.constant('APP_URL',"/propertyRental/");
/**
 * Configuration block
 */
rentalApp.config(["$stateProvider","$urlRouterProvider",'$httpProvider', function($stateProvider,$urlRouterProvider,$httpProvider){
		/**
		 * Default state defenition
		 */
		$urlRouterProvider.otherwise("/");
		/**
		 * HTTP response interceptor
		 */
		$httpProvider.interceptors.push('httpErrorResponseInterceptor');
}]);
/**
 * Run block
 */
rentalApp.run(["$rootScope","$state","ConversationService","$interval",function($rootScope, $state,ConversationService,$interval){
	/**
	 * Check if user logged in or not
	 */
	$rootScope.isLoggedIn = function(){
		var result = localStorage.getItem("currentUsername") !== null;
		return result;
	};
	/**
	 * Get current user authority
	 */
	$rootScope.getAuthority = function(){
		return localStorage.getItem("authority");
	};
	$rootScope.currentUsername = localStorage.getItem("currentUsername");
	/**
	 * Although it's checked on login but when user hard refeshes page it should check anyway
	 */
	if($rootScope.isLoggedIn()){
		$rootScope.newMsgs = new ConversationService.conversation.query({},function(){
			if($rootScope.newMsgs.length){
				$rootScope.$broadcast("newMessages");
			}
		});
	}
	/**
	 * Checking messages every 10 sec
	 */
	var checkNewMsgs = $interval(function(){
		if($rootScope.isLoggedIn()){
			$rootScope.newMsgs = new ConversationService.conversation.query({},function(){
				if($rootScope.newMsgs.length){
					$rootScope.$broadcast("newMessages");
				}
			});
		}
	},5000);
	/**
	 * Even that is fired on state change to redirect to right page after login
	 */
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams, fromState, fromStateParams){
        $rootScope.pageTitle = toState.data.pageTitle + " - Property rental system";
        $rootScope.unknownError = false;
        if(toState.url != '/login'){
	        $rootScope.returnToState = toState;
	        $rootScope.returnToStateParams = toStateParams;
        }
        if(toState.data.authorities.length != 0){
	        if($rootScope.isLoggedIn() && toState.data.authorities.indexOf($rootScope.getAuthority()) == -1){
	            event.preventDefault();
	        	$state.go('accessDenied');
	        }else if(!$rootScope.isLoggedIn()){
		            event.preventDefault();
		            $state.go('login');
	        }
        }
    });
}]);