/**
 * 
 */

var rentalApp = angular.module('RentalApp',['ui.router','ngResource','uiGmapgoogle-maps','ngAutocomplete','ui.bootstrap.datetimepicker','angularFileUpload','highcharts-ng','ui.bootstrap','PropertyService','PropertyController','PropertyDirective','PropertyFilters']);

rentalApp.constant('API_URL',"/propertyRental/api/");
rentalApp.constant('APP_URL',"/propertyRental/");

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
                	authorities:[],
                	pageTitle:"Home"
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
				params:{
					checkIn:"",
					checkOut:"",
					guestNumber:""
				},
                data : {
                    	authorities:[],
                    	pageTitle:"Find properties"
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
                    	authorities:[],
                    	pageTitle:"Show property"
                }
			})
			.state("addProperty",{
				url:"/addProperty",
				views:{
					"mainView":{
						templateUrl:"partials/addProperty/addProperty.html",
						controller:"AddPropertyCtrl"
					}
				},
                data : {
                    	authorities:['ROLE_USER'],
                    	pageTitle:"Add property"
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
                    	authorities:['ROLE_USER'],
                    	pageTitle:"Update property"
                }
			})
			.state("showMyProperties",{
				abstract:true,
				url:"/showMyProperties",
				views:{
					"mainView":{
						templateUrl:"partials/myProperties/showMyProperties.html",
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
            	templateUrl:"partials/myProperties/pleaseSelect.html",
                data : {
                	authorities:['ROLE_USER']
                }
            })
			.state("showMyProperties.detail",{
				url:"/{propertyId}",
				templateUrl:"partials/myProperties/showMyPropertiesDetail.html",
				controller:"ShowMyPropertyCtrl",
                data : {
                	authorities:['ROLE_USER']
                }
			})
			.state("showMyProperties.detail.bookings",{
				url:"/bookings",
				templateUrl:"partials/myProperties/showMyPropertyBookings.html",
				controller:"ShowMyPropertyBookingsCtrl",
                data : {
                	authorities:['ROLE_USER']
                }
			})
			.state("showMyProperties.detail.statistics",{
				url:"/statistics",
				templateUrl:"partials/myProperties/showMyPropertyStatistics.html",
				controller:"ShowMyPropertyStatisticsCtrl",
                data : {
                	authorities:['ROLE_USER']
                }
			})
			.state("showMyProperties.detail.update",{
				url:"/update",
				templateUrl:"partials/myProperties/updateProperty.html",
				controller:"UpdatePropertyCtrl",
                data : {
                	authorities:['ROLE_USER']
                }
			})
			.state("showMyProperties.detail.unDates",{
				url:"/unavailableDates",
				templateUrl:"partials/myProperties/unavailableDates.html",
				controller:"UnavailableDatesCtrl",
                data : {
                	authorities:['ROLE_USER']
                }
			})
			.state("showMyBookings",{
				url:"/showMyBookings",
				views:{
					"mainView":{
						templateUrl:"partials/showMyBookings.html",
						controller:"ShowMyBookingsCtrl"
					}
				},
                data : {
                	authorities:["ROLE_USER"],
                	pageTitle:"My bookings"
                }
			})
			.state("login",{
				url:"/login",
				views:{
					"mainView":{
						templateUrl:"partials/security/login.html",
						controller:"LoginCtrl"
					}
				},
                data : {
                    	authorities:[],
                    	pageTitle:"Login"
                }
			})
			.state("register",{
				url:"/register",
				views:{
					"mainView":{
						templateUrl:"partials/security/register.html",
						controller:"RegisterCtrl"
					}
				},
                data : {
                    	authorities:[],
                    	pageTitle:"Register"
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
                    authorities:['ROLE_USER']
                }
			})
			.state("accessDenied",{
                url : "/accessDenied",
                views:{
					"mainView":{
						templateUrl: "partials/security/accessDenied.html"
					}
				},
                data : {
                	authorities:[],
                	pageTitle:"Access denied"
                }
            })
            .state("conversations",{
            	abstract:true,
            	url:"/conversations",
            	views:{
            		"mainView":{
            			templateUrl:"partials/conversations/conversations.html",
            			controller:"ConversationsCtrl"
            		}
            	},
                data : {
                	authorities:['ROLE_USER'],
                	pageTitle:"Conversations"
                }
            })
            .state("conversations.pleaseSelect",{
            	url:"",
            	templateUrl:"partials/conversations/pleaseSelect.html",
                data : {
                	authorities:['ROLE_USER']
                }
            })
            .state("conversations.chat",{
            	url:"/{bookingId}",
            	templateUrl:"partials/conversations/chat.html",
            	controller:"ChatCtrl",
                data : {
                	authorities:['ROLE_USER']
                }
            });
	}
);
//to intercept both 401 and 403 errors
rentalApp.factory('httpErrorResponseInterceptor', [ '$q', '$location',
		function($q, $location) {
			return {
				response : function(responseData) {
					return responseData;
				},
				responseError : function error(response) {
					switch (response.status) {
					case 401:
						localStorage.removeItem("currentUsername");
						localStorage.removeItem("authority");
						$location.path('/login');
						break;
					case 403:
						$location.path('/accessDenied');
						break;
					default:
						//$location.path('/error');
						console.log("ERROR AAAA");
					}

					return $q.reject(response);
				}
			};
}]);
rentalApp.config(['$httpProvider', function($httpProvider) {
	$httpProvider.interceptors.push('httpErrorResponseInterceptor');
} ]);
rentalApp.run(["$rootScope","$state","ConversationService","$interval",function($rootScope, $state,ConversationService,$interval){
	$rootScope.isLoggedIn = function(){
		var result = localStorage.getItem("currentUsername") !== null;
		//console.log("controlling....",result);
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
		//console.log("toState",toState);
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;
        $rootScope.pageTitle = toState.data.pageTitle + " - Property rental system";
        //if(!$rootScope.isLoggedIn() && $rootScope.toState.data.loggedIn){
        if(!$rootScope.isLoggedIn() && $rootScope.toState.data.authorities.length != 0){
        	console.log("should check");
	        $rootScope.returnToState = toState;
	        $rootScope.returnToStateParams = toStateParams;
	        if($rootScope.isLoggedIn() && $rootScope.toState.data.authorities.indexOf($rootScope.getAuthority()) == -1){
	            event.preventDefault();
	        	$state.go('accessDenied');
	        }else{
	        	//console.log("REDIRECTING to login");
	            event.preventDefault();
	            $state.go('login');
	        }
        }
    });
}]);
