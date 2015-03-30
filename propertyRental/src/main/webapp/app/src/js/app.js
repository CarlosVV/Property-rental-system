/**
 * 
 */

var rentalApp = angular.module('RentalApp',['ui.router','ngResource','uiGmapgoogle-maps','ngAutocomplete','ui.bootstrap.datetimepicker','angularFileUpload','PropertyService','PropertyController','PropertyDirective']);

rentalApp.constant('API_URL',"/propertyRental/");

rentalApp.config(
	function($stateProvider,$urlRouterProvider){
		$urlRouterProvider.otherwise("/");
		$stateProvider
			.state("home", {
				url:"/",
				views: {
					"mainView":{
						templateUrl:"partials/home.html",
						controller:"HomeController"
					}
				},
                data : {
                    loggedIn:false
                }
			})
			.state("queryProperties",{
				url:"/queryProperties/:address/:country/:city/:admArea/:checkIn/:checkOut/:guestNumber",
				views: {
					"mainView":{
						templateUrl:"partials/propertyListByQuery.html",
						controller:"SearchPropertiesCtrl"
					}
				},
                data : {
                    loggedIn:false
                }
			})
			.state("showProperty",{
				url:"/showProperty/{propertyId}/{checkIn}/{checkOut}/{guestNumber}",
				views:{
					"mainView":{
						templateUrl:"partials/showProperty.html",
						controller:"ShowPropertyCtrl"
					}
				},
				params:{
					checkIn:"",
					checkOut:"",
					guestNumber:""
				},
                data : {
                    loggedIn:false
                }
			})
			.state("addProperty",{
				url:"/addProperty",
				views:{
					"mainView":{
						templateUrl:"partials/addProperty.html",
						controller:"AddPropertyCtrl"
					}
				},
                data : {
                    loggedIn:true
                }
			})
			.state("updateProperty",{
				url:"/updateProperty/{propertyId}",
				views:{
					"mainView":{
						templateUrl:"partials/updateProperty.html",
						controller:"UpdatePropertyCtrl"
					}
				},
                data : {
                    loggedIn:true
                }
			})
			.state("showMyProperties",{
				url:"/showMyProperties",
				views:{
					"mainView":{
						templateUrl:"partials/showMyProperties.html",
						controller:"ShowMyPropertiesCtrl"
					}
				},
                data : {
                    loggedIn:true
                }
			})
			.state("login",{
				url:"/login",
				views:{
					"mainView":{
						templateUrl:"partials/login.html",
						controller:"LoginCtrl"
					}
				},
                data : {
                    loggedIn:false
                }
			})
			.state("register",{
				url:"/register",
				views:{
					"mainView":{
						templateUrl:"partials/register.html",
						controller:"RegisterCtrl"
					}
				},
                data : {
                    loggedIn:false
                }
			})
			.state("logout",{
				url:"/logout",
				views:{
					"mainView":{
						controller:"LogoutCtrl"
					}
				},
                data : {
                    loggedIn:true
                }
			});
	}
);
//to intercept all 403 errors
rentalApp.factory('httpErrorResponseInterceptor', [ '$q', '$location',
		function($q, $location) {
			return {
				response : function(responseData) {
					return responseData;
				},
				responseError : function error(response) {
					switch (response.status) {
					case 403:
						localStorage.removeItem("currentUsername");
						$location.path('/login');
						break;
					default:
						$location.path('/error');
					}

					return $q.reject(response);
				}
			};
		} ]);
rentalApp.config([ '$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('httpErrorResponseInterceptor');
} ]);
rentalApp.run(["$rootScope","$state",function($rootScope, $state){
	$rootScope.isLoggedIn = function(){
		var result = localStorage.getItem("currentUsername") !== null;
		//console.log("controlling....",result);
		return result;
	};
	$rootScope.$on('$stateChangeStart', function(event, toState, toStateParams){
		//console.log("toState",toState);
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        if(!$rootScope.isLoggedIn() && $rootScope.toState.data.loggedIn){
	        $rootScope.returnToState = toState;
	        $rootScope.returnToStateParams = toStateParams;
        	//console.log("REDIRECTING to login");
            event.preventDefault();
            $state.go('login');
        }
    })
}]);
