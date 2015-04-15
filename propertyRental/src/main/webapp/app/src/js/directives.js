/**
 * 
 */
var propertyDirective = angular.module("PropertyDirectives", []);

//this directive is used to check whether user has chosen address from the list that is provided by google
//validates ng-model specified in input
//http://habrahabr.ru/post/167793/
//passing STRING of some object (usually giving country)
propertyDirective.directive('checkQuery', function () {
    var isValid = function(query) {
        if(query != '' && typeof query !== 'undefined'){
        	console.log("dunno",query);
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
            		console.log("HUH",isValid(actualValue));
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
/*propertyDirective.directive('checkDate', function () {
    var isValid = function(date,unavailableDates) {
    	var compare = moment(date,"DD/MM/YYYY");
    	for(var j=0;j<unavailableDates.length;j++){
			var start = moment(unavailableDates[j].startDate);
			var end = moment(unavailableDates[j].endDate);
			if(compare.isBetween(start,end,'day') || compare.isSame(start,'day') || compare.isSame(end,'day')){
				return false;
			}
			if(compare.isBefore(moment(),'day') || compare.isSame(moment(),'day')){
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
            		var unDatesArray = scope.$eval(actualValue);
            		if(unDatesArray.length){
            			console.log("CHECKIN DATE");
            			ngModelCtrl.$setValidity('validDate', isValid(viewValue,unDatesArray));
            		}
            	});
        		return viewValue;
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	//it is for checking whether the variable is passed to directive or not
            	//http://stackoverflow.com/questions/16232917/angularjs-how-to-pass-scope-variables-to-a-directive
            	attrs.$observe('checkDate',function(actualValue){
            		var unDatesArray = scope.$eval(actualValue);
            		if(unDatesArray.length){
            			console.log("CHECKIN DATE");
            			ngModelCtrl.$setValidity('validDate', isValid(modelValue,unDatesArray));
            		}
            	});
            	return modelValue;
            });
        }
    };
});*/
propertyDirective.directive('checkDatesMatch', function () {
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
    		//console.log("WRONG");
    		return false;
    	}
    	//console.log("EVERYTHING IS OK");
    	return true;
    };
    var isNotUnavailable = function(date,unavailableDates) {
    	if(!angular.isUndefined(unavailableDates)){
	    	var compare = moment(date,"DD/MM/YYYY");
	    	for(var j=0;j<unavailableDates.length;j++){
				var start = moment(unavailableDates[j].startDate);
				var end = moment(unavailableDates[j].endDate);
				if(compare.isBetween(start,end,'day') || compare.isSame(start,'day') || compare.isSame(end,'day')){
					return false;
				}
				if(compare.isBefore(moment(),'day') || compare.isSame(moment(),'day')){
					return false;
				}
			}
			return true;
    	}else{
    		return true;
    	}
    };
    return {
        require:'ngModel',
        scope:{
        	unavailableDates : "=checkDate"
        },
        link:function (scope, elm, attrs, ngModelCtrl) {
            ngModelCtrl.$parsers.unshift(function (viewValue) {
            	//observe other input (they are in pairs)
            	//if other input changes(passed value to this directive changes, eg query.checkIn), we should check it (in observe)
            	//after that we check current input
            	//in a criss-cross manner validation 
            	//it seems that checkDatesMatch - reference to another input lol
            	attrs.$observe('checkDatesMatch',function(actualValue){
            		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,viewValue,scope.$eval(actualValue)));
            	});
            	//if no watch and it doesn't have true, unavailableDates will be undefined.
            	scope.$watch('unavailableDates',function(){
            		//console.log(scope.unavailableDates);
                	var result = isNotUnavailable(viewValue,scope.unavailableDates);
            		var finalResult = result && isValid(attrs.name,viewValue,scope.$eval(attrs.checkDatesMatch));
            		//console.log(result);
            		ngModelCtrl.$setValidity('valid'+attrs.name, finalResult);
            	},true);//very important http://stackoverflow.com/questions/11135864/scope-watch-is-not-updating-value-fetched-from-resource-on-custom-directive
        		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,viewValue,scope.$eval(attrs.checkDatesMatch)));
        		return viewValue;
            });
            ngModelCtrl.$formatters.unshift(function (modelValue) {
            	//it is for checking whether the variable is passed to directive or not
            	//http://stackoverflow.com/questions/16232917/angularjs-how-to-pass-scope-variables-to-a-directive
            	attrs.$observe('checkDatesMatch',function(actualValue){
            		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,modelValue,scope.$eval(actualValue)));
            	});
            	scope.$watch('unavailableDates',function(){
            		//console.log(scope.unavailableDates);
                	var result = isNotUnavailable(modelValue,scope.unavailableDates);
            		var finalResult = result && isValid(attrs.name,modelValue,scope.$eval(attrs.checkDatesMatch));
            		//console.log(result);
            		ngModelCtrl.$setValidity('valid'+attrs.name, finalResult);
            	},true);
        		ngModelCtrl.$setValidity('valid'+attrs.name, isValid(attrs.name,modelValue,scope.$eval(attrs.checkDatesMatch)));
            	return modelValue;
            });
        }
    };
});
//alternative to $scope.$watch solution
propertyDirective.directive('filterDate', function($filter){
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
propertyDirective.directive('checkList',["$parse",function($parse){
	return{
		restrict:'A',
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
//OH GOD I REINVENTED A WHEEL ( max="{{property.guestCount}}")
propertyDirective.directive('checkGuests',function(){
	var isValid = function(guestNumber,maxAllowedGuests) {
		return guestNumber <= maxAllowedGuests && guestNumber > 0;
    };
	return{
		require:'ngModel',
		scope:{
			maxAllowedGuests:"=checkGuests"
		},
		link:function(scope,elem,attrs,ngModel){
			ngModel.$parsers.unshift(function (viewValue) {
        		ngModel.$setValidity('validGuests', isValid(viewValue,scope.maxAllowedGuests));
        		return viewValue;
            });
			ngModel.$formatters.unshift(function (modelValue) {
        		ngModel.$setValidity('validGuests', isValid(modelValue,scope.maxAllowedGuests));
            	return modelValue;
            });
		}
	};
});
propertyDirective.directive('countBookingPrice',function(){
	return{
		scope:{
			checkIn:"=",
			checkOut:"=",
			nightPrice:"="
		},
		templateUrl:"modules/directives/partials/bookingPrice.html",
		link:function(scope,element,attr){
			console.log("PLS DUDE",scope.nightPrice);
			scope.$watch("checkIn",function(newVal){
				if(typeof scope.checkIn !== 'undefined' && typeof scope.checkOut !== 'undefined'){
					   var startDate = moment(scope.checkIn);
					   var endDate = moment(scope.checkOut);
					   var difference = endDate.diff(startDate,'days');
					   //console.log(difference);
					   var result = difference*scope.nightPrice;
					   if(result > 0){
						   scope.totalPrice = difference*scope.nightPrice;
						   scope.nightCount = difference;
					   }else{
						   delete scope.totalPrice;
						   delete scope.nightCount;
					   }
				}
			});
			scope.$watch("checkOut",function(newVal){
				if(typeof scope.checkIn !== 'undefined' && typeof scope.checkOut !== 'undefined'){
					   var startDate = moment(scope.checkIn);
					   var endDate = moment(scope.checkOut);
					   var difference = endDate.diff(startDate,'days');
					   //console.log(difference);
					   var result = difference*scope.nightPrice;
					   if(result > 0){
						   scope.totalPrice = difference*scope.nightPrice;
						   scope.nightCount = difference;
					   }else{
						   delete scope.totalPrice;
						   delete scope.nightCount;
					   }
				}
			});
			/*attr.$observe('checkIn', function(value) {
				   console.log(value);
				   var startDate = moment(scope.checkIn);
				   var endDate = moment(scope.checkOut);
				   var difference = endDate.diff(startDate,'days');
				   console.log(difference);
				   scope.totalPrice = difference*scope.nightPrice;
			});
			attr.$observe('checkOut', function(value) {
				   console.log(value);
				   var startDate = moment(scope.checkIn);
				   var endDate = moment(scope.checkOut);
				   var difference = endDate.diff(startDate,'days');
				   console.log(difference);
				   scope.totalPrice = difference*scope.nightPrice;
			});*/
		}
	};
});
propertyDirective.directive("myDatepicker",function(){
	return {
		restrict:"E",
		scope:{
			unavailableDates:"=",
			bookedDates:"=",
			updateUnDates:"&"
		},
		templateUrl:"modules/directives/partials/datepicker.html",
		link : function(scope){
			console.log("STARTING BUILDING CALENDAR");
			/*scope.$watch('unavailableDates', function(){
				console.log("unDates",scope.unavailableDates);
			});
			scope.$watch('bookedDates',function(){
				console.log("bookedDates",scope.bookedDates);
			});*/
			scope.$watchGroup(['unavailableDates','bookedDates'],function(newValues){
				//console.log(newValues[0],'AND',newValues[1]);
				//console.log(newValues[0])
				var bookedDates = [];
				for (var i = 0; i < newValues[1].length; i++) {
					var start = moment(newValues[1][i].startDate);
					var end = moment(newValues[1][i].endDate);
					while(start.isBefore(end,'day') || start.isSame(end,'day')){
						bookedDates.push(start.format("DD/MM/YYYY"));
						start.add(1,'day');
					}
				}
				var unavailableDates = [];
				for(var i=0;i<newValues[0].length;i++){
					unavailableDates.push(new Date(newValues[0][i].when));
				}
				$('.datepicker').datepicker({
					orientation:"top auto",
				    startDate: '0d',
				    datesDisabled:bookedDates
				})
				.on("changeDate",function(e){
					//console.log("heey",e.dates);
					scope.updateUnDates({dates:e.dates});
					$("#datepicker_data_input").val(
						$(".datepicker").datepicker("getFormattedDate")	
					);
				});
				$('.datepicker').datepicker("setDates",unavailableDates);
			});
		}
	};
});
propertyDirective.directive("showBookingStatus",function(){
	return{
		restrict:"E",
		scope:{
			list:"=",
			currentStatusId:"="
		},
		templateUrl:"modules/directives/partials/showBookingStatus.html",
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