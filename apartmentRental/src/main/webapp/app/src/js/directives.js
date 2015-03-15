/**
 * 
 */
var apartmentDirective = angular.module("ApartmentDirective", []);

apartmentDirective.directive('checkQuery', function () {
    var isValid = function(query) {
    	//console.log("checking validity",query);
    	//console.log(query);
    	var result = typeof query.country;
    	//console.log("result: ",result);
        if(typeof query.country !== 'undefined'){
        	//console.log("TRUE");
        	return true;
        }else{
        	//console.log("FALSE");
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
            		ngModelCtrl.$setValidity('strongPass', isValid(scope.$eval(actualValue)));
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
            		ngModelCtrl.$setValidity('strongPass', isValid(scope.$eval(actualValue)));
            	});
            	return modelValue;
                /*ngModelCtrl.$setValidity('strongPass', isValid(scope.$eval(attrs.checkQuery)));
            	console.log(scope.$eval(attrs.checkQuery));
                return modelValue;*/
            });
        }
    };
});