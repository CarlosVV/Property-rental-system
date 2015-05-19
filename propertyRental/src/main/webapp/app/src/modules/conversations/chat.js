/**
 * Chat module.
 */
var chat = angular.module("chat",[]);
chat.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("conversations.chat",{
    	url:"/{bookingId}",
    	templateUrl:"modules/conversations/partials/chat.html",
    	controller:"ChatCtrl",
        data : {
        	authorities:['ROLE_USER']
        }
    });
}]);
chat.controller("ChatCtrl",["$scope","ConversationService","$stateParams","$rootScope",function($scope,ConversationService,$stateParams,$rootScope){
	$scope.message = {};
	$scope.currentBooking = {};
	$scope.messages = new ConversationService.conversation.query({bookingId:$stateParams.bookingId},function(){
		if($rootScope.newMsgs.length){
			angular.forEach($rootScope.newMsgs, function(msg) {
				if(msg.bookingId == $stateParams.bookingId){
					ConversationService.conversation.markRead({bookingId:msg.bookingId});
				}
			});
		}
	});
	//watching for new msgs while we are in chat
	/*$rootScope.$watch('newMsgs',function(newVal){
		if($rootScope.newMsgs.length){
			var gotNew = false;
			for(var i=0;i<$rootScope.newMsgs.length;i++){
				if($rootScope.newMsgs[i].bookingId == $stateParams.bookingId){
					$scope.messages.push($rootScope.newMsgs[i]);
					$rootScope.newMsgs.splice(i,1);
					gotNew = true;
					i--;
				}
			}
			if(gotNew){
				ConversationService.conversation.markRead({bookingId:$stateParams.bookingId});
			}
		}
	},true);*/
	$scope.$on("newMessages",function(){
		if($rootScope.newMsgs.length){
			var gotNew = false;
			for(var i=0;i<$rootScope.newMsgs.length;i++){
				if($rootScope.newMsgs[i].bookingId == $stateParams.bookingId){
					$scope.messages.push($rootScope.newMsgs[i]);
					$rootScope.newMsgs.splice(i,1);
					gotNew = true;
					i--;
				}
			}
			if(gotNew){
				ConversationService.conversation.markRead({bookingId:$stateParams.bookingId});
			}
		}
	});
	$scope.$watchGroup(['bookingsStatuses','myBookings','myPropertiesBookings',function(){
		if(!angular.isUndefined($scope.bookingsStatuses) && !angular.isUndefined($scope.myBookings) && 
				!angular.isUndefined($scope.myPropertiesBookings)){
			var foundInMyBookings = false;
			angular.forEach($scope.myBookings, function(booking) {
				if(booking.bookingId == $stateParams.bookingId){
					$scope.currentBooking = booking;
					foundInMyBookings = true;
				}
			});
			if(!foundInMyBookings){
				angular.forEach($scope.myPropertiesBookings, function(booking) {
					if(booking.bookingId == $stateParams.bookingId){
						$scope.currentBooking = booking;
					}
				});
			}
		}
	}]);
	
	$scope.sendMessage = function(formObject){
		var foundInMyBookings = false;
		angular.forEach($scope.myBookings, function(booking) {
			if(booking.bookingId == $stateParams.bookingId){
				$scope.message.receiverUsername = booking.propertyAccountUsername;
				foundInMyBookings = true;
			}
		});
		if(!foundInMyBookings){
			angular.forEach($scope.myPropertiesBookings, function(booking) {
				if(booking.bookingId == $stateParams.bookingId){
					$scope.message.receiverUsername = booking.userAccountUsername;
				}
			});
		}
		$scope.message.bookingId = $stateParams.bookingId;
		$scope.message.senderUsername = localStorage.getItem("currentUsername");
		ConversationService.conversation.save({},$scope.message,function(newMsg){
			$scope.messages.push(newMsg);
			$scope.message = {};
			formObject.$setPristine();
		});
	};
}]);