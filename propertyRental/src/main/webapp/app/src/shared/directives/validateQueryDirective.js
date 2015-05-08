var propertyDirective = angular.module("ValidateQueryDirective", []);
//this directive is used to check whether user has chosen address from the list that is provided by google
//validates ng-model specified in input
//http://habrahabr.ru/post/167793/
//passing STRING of some object (usually giving country)
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
            	//this variant cuz we have {{}} in our attribute check-query="{{query}}"
            	attrs.$observe('validateQuery',function(actualValue){
            		//можно исопльзовать scope.query??
            		//scope.$eval to transform from string to javascript object
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