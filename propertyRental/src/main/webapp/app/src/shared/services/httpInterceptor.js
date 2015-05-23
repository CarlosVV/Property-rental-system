var httpInterceptor = angular.module('HttpInterceptorService',[]);
//to intercept both 401 and 403 errors
httpInterceptor.factory('httpErrorResponseInterceptor', [ '$q', '$location','$rootScope', function($q, $location,$rootScope) {
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
				console.log("Unknown error occured.");
				$rootScope.unknownError = true;
			}
			return $q.reject(response);
		}
	};
}]);