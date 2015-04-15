var propertyDirective = angular.module("BookingStatusDirective", []);
propertyDirective.directive("showBookingStatus",function(){
	return{
		restrict:"E",
		scope:{
			list:"=",
			currentStatusId:"="
		},
		templateUrl:"shared/directives/partials/showBookingStatus.html",
		link:function(scope){
			scope.$watch('currentStatusId',function(){
				angular.forEach(scope.list,function(value){
					if(value.id == scope.currentStatusId){
						scope.bookingStatus = value.name;
						scope.bookingStatusDesc = value.description;
					}
				});
			});
		}
	}
});