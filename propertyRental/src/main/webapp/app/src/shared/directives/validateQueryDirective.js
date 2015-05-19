var propertyDirective = angular.module("ValidateQueryDirective", []);

/**
 * This directive is used to check whether user has chosen address from the list that is provided by google
 */
propertyDirective.directive('validateQuery', function () {
    var isValid = function(query) {
        if(query != '' && typeof query !== 'undefined'){
        	return true;
        }else{
        	return false;
        }
    };

    return {
        require:'ngModel',
        link:function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.unshift(function (viewValue) {
            	//attrs.$observe because we have {{}} in our attribute check-query="{{query}}"
            	attrs.$observe('validateQuery',function(actualValue){
            		ngModelCtrl.$setValidity('validQuery', isValid(actualValue));
            	});
        		return viewValue;
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	attrs.$observe('validateQuery',function(actualValue){
            		ngModelCtrl.$setValidity('validQuery', isValid(actualValue));
            	});
            	return modelValue;
            });
        }
    };
});