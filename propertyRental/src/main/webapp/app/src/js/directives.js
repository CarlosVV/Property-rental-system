/**
 * 
 */
var apartmentDirective = angular.module("PropertyDirective", []);

//this directive is used to check whether user has chosen address from the list that is provided by google
//validates ng-model specified in input
//http://habrahabr.ru/post/167793/
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
//check whether date is allowed
apartmentDirective.directive('checkDate', function () {
    var isValid = function(date,unavailableDates) {
    	var compare = moment(date,"DD/MM/YYYY");
    	for(var j=0;j<unavailableDates.length;j++){
			var start = moment(unavailableDates[j].startDate);
			var end = moment(unavailableDates[j].endDate);
			if(compare.isBetween(start,end,'day') || compare.isSame(start,'day') || compare.isSame(end,'day')){
				return false;
			}
		}
		return true;
    };
    return {
        require:'ngModel',
        link:function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.unshift(function (viewValue) {
            	attrs.$observe('checkDate',function(actualValue){
            		ngModelCtrl.$setValidity('validDate', isValid(viewValue,scope.$eval(actualValue)));
            	});
        		return viewValue;
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	//it is for checking whether the variable is passed to directive or not
            	//http://stackoverflow.com/questions/16232917/angularjs-how-to-pass-scope-variables-to-a-directive
            	attrs.$observe('checkDate',function(actualValue){
            		ngModelCtrl.$setValidity('validDate', isValid(modelValue,scope.$eval(actualValue)));
            	});
            	return modelValue;
            });
        }
    };
});
apartmentDirective.directive('checkDatesMatch', function () {
    var isValid = function(name,date1,date2) {
		if(typeof date1 === 'undefined' || typeof date2 === 'undefined')
			return true;
    	var checkIn;
    	var checkOut;
    	if(name == "checkIn"){
    		checkIn = moment(date1,"DD/MM/YYYY");
    		checkOut = moment(date2);
    	}else{
    		checkIn = moment(date2);
    		checkOut = moment(date1,"DD/MM/YYYY");
    	}
		//console.log("checkIn",checkIn._d);
		//console.log("checkOut",checkOut._d);
    	if(checkIn.isAfter(checkOut)){
    		console.log("WRONG");
    		return false;
    	}
    	console.log("EVERYTHING IS OK");
    	return true;
    };
    return {
        require:'ngModel',
        link:function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.unshift(function (viewValue) {
            	//observe other input (they are in pairs)
            	//if other input changes(passed value to this directive changes, eg query.checkIn), we should check it (in observe)
            	//after that we check current input
            	attrs.$observe('checkDatesMatch',function(actualValue){
            		console.log("currentlyActual:",attrs.name);
            		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,viewValue,scope.$eval(actualValue)));
            	});
        		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,viewValue,scope.$eval(attrs.checkDatesMatch)));
        		return viewValue;
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	//it is for checking whether the variable is passed to directive or not
            	//http://stackoverflow.com/questions/16232917/angularjs-how-to-pass-scope-variables-to-a-directive
            	attrs.$observe('checkDatesMatch',function(actualValue){
            		console.log("currentlyView:",attrs.name);
            		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,modelValue,scope.$eval(actualValue)));
            	});
        		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,modelValue,scope.$eval(attrs.checkDatesMatch)));
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
				if(typeof inputValue !== 'undefined'){
					var transformedInput = $filter("date")(inputValue,'dd/MM/yyyy');
					modelCtrl.$setViewValue(transformedInput);
					modelCtrl.$render();
					return transformedInput;
				}
			});
			//convert data from view format to model format
			modelCtrl.$parsers.push(function(data){
				return moment(data,"DD/MM/YYYY")._d;
			});
		}
	};
});
//from http://stackoverflow.com/questions/14514461/how-can-angularjs-bind-to-list-of-checkbox-values
apartmentDirective.directive('checkList',["$parse",function($parse){
	return{
		scope:{
			list:'=checkList',
			value:'@'
		},
		link:function(scope,elem,attrs){
			var handler = function(setup){
				if(typeof scope.list != 'undefined'){
					var checked = elem.prop('checked');
					var index = scope.list.map(function(o) { return o.id; }).indexOf(scope.$eval(scope.value).id);
					if (checked && index == -1) {
				          if (setup) elem.prop('checked', false);
				          else scope.list.push(scope.$eval(scope.value));
				        } else if (!checked && index != -1) {
				          if (setup) elem.prop('checked', true);
				          else scope.list.splice(index, 1);
				    }
				}
				
			};
			//if there are any data on startup setupHandler takes it 
			var setupHandler = handler.bind(null,true);
			var changeHandler = handler.bind(null,false);
			elem.bind('change', function(){
				scope.$apply(changeHandler);
			});
			scope.$watch('list', setupHandler, true);
		}
	};
}]);
