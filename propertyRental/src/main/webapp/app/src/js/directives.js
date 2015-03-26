/**
 * 
 */
var apartmentDirective = angular.module("PropertyDirective", []);

//this directive is used to check whether user has chosen address from the list that is provided by google
apartmentDirective.directive('checkQuery', function () {
    var isValid = function(query) {
        if(typeof query !== 'undefined'){
        	return true;
        }else{
        	return false;
        }
    };

    return {
        require:'ngModel',
        link:function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.unshift(function (viewValue) {
            	//console.log("VVVVVVVVVVVVVVIIIIIIIEEEEEEWWWWWW",viewValue);
            	//this variant cuz we have {{}} in our attribute check-query="{{query}}"
            	attrs.$observe('checkQuery',function(actualValue){
            		//console.log(actualValue);
            		//можно исопльзовать scope.query??
            		//scope.$eval to transform from string to javascript object
            		ngModelCtrl.$setValidity('validQuery', isValid(actualValue));
            	});
        		return viewValue;
                /*ngModelCtrl.$setValidity('strongPass', isValid(scope.$eval(attrs.checkQuery)));
            	console.log(scope.$eval(attrs.checkQuery));
                return viewValue;*/
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	//console.log("VVVVVVVVVVVVVVIIIIIIIEEEEEEWWWWWW22222222",modelValue);
            	attrs.$observe('checkQuery',function(actualValue){
            		//console.log(actualValue);
            		ngModelCtrl.$setValidity('validQuery', isValid(actualValue));
            	});
            	return modelValue;
                /*ngModelCtrl.$setValidity('strongPass', isValid(scope.$eval(attrs.checkQuery)));
            	console.log(scope.$eval(attrs.checkQuery));
                return modelValue;*/
            });
        }
    };
});
//alternative to $scope.$watch solution
apartmentDirective.directive('filterDate', function($filter){
	return {
		require:'ngModel',
		link: function(scope,element,attrs,modelCtrl){
			//convert data from model format to view format
			modelCtrl.$formatters.push(function(inputValue){
				var transformedInput = $filter("date")(inputValue,'dd/MM/yyyy');
				modelCtrl.$setViewValue(transformedInput);
				modelCtrl.$render();
				return transformedInput;
			});
			//convert data from view format to model format
			modelCtrl.$parsers.push(function(data){
				return moment(data,"DD/MM/YYYY");
			});
		}
	};
});