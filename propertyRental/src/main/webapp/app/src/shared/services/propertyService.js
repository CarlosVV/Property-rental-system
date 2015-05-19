var propertyService = angular.module("PropertyServiceModule", []);
propertyService.factory("PropertyService", [ "$resource", "API_URL", function($resource,API_URL) {
	var propertyService = {
		property: $resource(API_URL+'properties/:id', {}, {
				find:{
					method:"POST",
					isArray:true,
					url:API_URL+"properties/search"
				},
				findMyProperties:{
					method:"GET",
					isArray:true,
					url:API_URL+"properties/myProperties/:ownerId"
				},
				update:{method:"PUT"}
		}),
		propertyTypes: $resource(API_URL+'properties/propertyTypes', {}),
		propertyFacilities : $resource(API_URL+'properties/propertyFacilities',{}),
		reviews : $resource(API_URL+"properties/reviews/:id",{},{
			canSendReviews:{
				method:"GET",
				url:API_URL+"bookings/canSendReviews/:propertyId"
			}
		})
	};
	return propertyService;
}]);