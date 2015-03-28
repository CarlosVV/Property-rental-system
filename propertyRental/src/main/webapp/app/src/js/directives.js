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
            	//this variant cuz we have {{}} in our attribute check-query="{{query}}"
            	attrs.$observe('checkQuery',function(actualValue){
            		//console.log(actualValue);
            		//можно исопльзовать scope.query??
            		//scope.$eval to transform from string to javascript object
            		ngModelCtrl.$setValidity('validQuery', isValid(actualValue));
            	});
        		return viewValue;
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	attrs.$observe('checkQuery',function(actualValue){
            		ngModelCtrl.$setValidity('validQuery', isValid(actualValue));
            	});
            	return modelValue;
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
apartmentDirective.directive('checkList',["$parse",function($parse){
	return{
		scope:{
			list:'=checkList',
			value:'@'
		},
		link:function(scope,elem,attrs){
			var handler = function(setup){
				var checked = elem.prop('checked');
				var index = scope.list.indexOf(scope.value);
				if (checked && index == -1) {
			          if (setup) elem.prop('checked', false);
			          else scope.list.push(scope.$eval(scope.value));
			        } else if (!checked && index != -1) {
			          if (setup) elem.prop('checked', true);
			          else scope.list.splice(index, 1);
			    }
				
			};
			//if there are any data on startup setupHandler takes it 
			//var setupHandler = handler.bind(null,true);
			var changeHandler = handler.bind(null,false);
			elem.bind('change', function(){
				scope.$apply(changeHandler);
			});
			//scope.$watch('list', setupHandler, true);
		}
	};
}]);