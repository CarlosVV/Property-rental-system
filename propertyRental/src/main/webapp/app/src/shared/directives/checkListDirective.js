var propertyDirective = angular.module("CheckListDirective", []);
/**
 * Forms list from check buttons.
 */
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