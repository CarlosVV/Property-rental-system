var propertyService = angular.module("ConversationServiceModule", []);
propertyService.factory("ConversationService",["$resource","API_URL",function($resource,API_URL){
	var conversationService = {
			conversation: $resource(API_URL+"messages/:bookingId",{},{
				markRead:{
					method:"GET",
					url:API_URL+"messages/markRead/:bookingId"
				}
			})
	};
	return conversationService;
}]);