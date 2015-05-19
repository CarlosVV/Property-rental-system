/**
 * Conversations module.
 */
var conversations = angular.module("conversations",[]);
conversations.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("conversations",{
    	abstract:true,
    	url:"/conversations",
    	views:{
    		"mainView":{
    			templateUrl:"modules/conversations/partials/conversations.html",
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
    	templateUrl:"modules/conversations/partials/pleaseSelect.html",
        data : {
        	authorities:['ROLE_USER']
        }
    });
}]);
conversations.controller("ConversationsCtrl",["$scope","BookingService","$rootScope","$stateParams",function($scope,BookingService,$rootScope,$stateParams){
	$scope.myBookings = new BookingService.booking.myBookings();
	$scope.bookingsStatuses = new BookingService.bookingsStatuses.query();
	$scope.myPropertiesBookings = new BookingService.booking.allMyPropertiesBookings();
	$scope.newMsgsAvailable = function(bookingId){
		for(var i=0;i<$rootScope.newMsgs.length;i++){
			if($rootScope.newMsgs[i].bookingId == bookingId){
				return true;
			}
		}
		return false;
	};
}]);