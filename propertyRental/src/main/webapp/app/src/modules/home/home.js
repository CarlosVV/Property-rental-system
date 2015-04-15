var home = angular.module("home",[]);

home.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("home", {
		url:"/",
		views: {
			"mainView":{
				templateUrl:"modules/home/partials/home.html",
				controller:"HomeController"
			}
		},
        data : {
        	authorities:[],
        	pageTitle:"Home"
        }
	});
}]);

home.controller("HomeController",["$scope","PropertyService","$state","$filter","AccountService",function($scope,PropertyService,$state,$filter,AccountService){
	$scope.neededAddressComponents = {
			locality : 'long_name',
			administrative_area_level_1: 'short_name',
			country: 'long_name'
	};
	$scope.addressAssembler = {
			locality:'city',
			administrative_area_level_1:'administrativeArea',
			country:'country'
	};
	$scope.$watch('query.checkIn',function(newVal){
		console.log("NEW VAL CHECKIN:",$scope.query.checkIn);
	});
	$scope.query = {};
	$scope.details = {};
	$scope.autoCompleteOptions = {watchEnter:false};
	//get address details for query
	$scope.$watch('details',function(newVal){
		if(typeof newVal.address_components !== 'undefined'){
			//resetting query object for new location
			$scope.query.city = "";
			$scope.query.administrativeArea = "";
			$scope.query.country = "";
			for(var i=0; i < newVal.address_components.length; i++){
				var addressType = newVal.address_components[i].types[0];
				if($scope.neededAddressComponents[addressType]){
					$scope.query[$scope.addressAssembler[addressType]] = newVal.address_components[i][$scope.neededAddressComponents[addressType]];
				}
			}
		}
		console.log("query: ",$scope.query);
	});
	
	$scope.queryProperties = function(){
		console.log("sending",$filter("date")($scope.query.checkIn,'dd/MM/yyyy'));
		$state.go("queryProperties",{
			address:$scope.query.address,
			country:$scope.query.country,
			city:$scope.query.city,
			admArea:$scope.query.administrativeArea,
			checkIn:$filter("date")($scope.query.checkIn,'dd/MM/yyyy'),
			checkOut:$filter("date")($scope.query.checkOut,'dd/MM/yyyy'),
			guestNumber:$scope.query.guestNumber
		});
	}
	$scope.resetQuery = function(){
		console.log("execute pls");
		$scope.query.city = "";
		$scope.query.administrativeArea = "";
		$scope.query.country = "";
		console.log($scope.query.city);
	}
	//old way, should use directive instead!
	//moreover it is incorrect to use such method! cuz i am changing value of the variable but datepicker consumes moment object not string!
	//not sure how to show it in thesis.
	//i think i will just create directive for above $scope.$watch('details',f...
	/*$scope.$watch('data.dateDropDownInput',function(newVal){
		if(typeof $scope.data !== 'undefined'){
			$scope.data.dateDropDownInput = $filter("date")(newVal,'dd-MM-yyyy');
			console.log($scope.data.dateDropDownInput);
		}
	});*/
	$scope.beforeRender = function($view, $dates, $leftDate, $upDate, $rightDate){
		for(var i=0;i<$dates.length;i++){
			var compare = moment($dates[i].utcDateValue);
			if(moment().diff(compare,'days') > 0){
				$dates[i].selectable = false;
			}
		}
	};
}]);