var searchProperties = angular.module("searchProperties",[]);
searchProperties.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("queryProperties",{
		url:"/queryProperties/:address/:country/:city/:admArea/:checkIn/:checkOut/:guestNumber",
		views: {
			"mainView":{
				templateUrl:"modules/searchProperties/partials/searchProperties.html",
				controller:"SearchPropertiesCtrl"
			}
		},
		params:{
			checkIn:"",
			checkOut:"",
			guestNumber:""
		},
        data : {
            	authorities:[],
            	pageTitle:"Find properties"
        }
	});
}]);
searchProperties.controller("SearchPropertiesCtrl",["$scope", "PropertyService", "$stateParams", "$location","$filter", function($scope, PropertyService, $stateParams, $location,$filter){
	$scope.propertyFacilities = PropertyService.propertyFacilities.query();
	$scope.propertyTypes = PropertyService.propertyTypes.query();
	$scope.pricePerNightOptions = [
		{id:1,
			lowerBound:0,
			upperBound:50
		},{id:2,
			lowerBound:50,
			upperBound:100
		},{id:3,
			lowerBound:100,
			upperBound:150
		},{id:4,
			lowerBound:150,
			upperBound:200
		},{id:5,
			lowerBound:250,
		},
	];
	$scope.sorting = {propertyFacilities:[],propertyTypes:[],prices:[]};
	//for callendar
	//if no check in/check out specified, then undefined and no weird 01/01/0001 on calendar
	var checkInTemp = undefined;
	var checkOutTemp = undefined;
	if($stateParams.checkIn != "" || $stateParams.checkOut != ""){
		console.log("ok",$stateParams.checkIn);
		checkInTemp = moment($stateParams.checkIn,'DD/MM/YYYY')._d;
		checkOutTemp = moment($stateParams.checkOut,'DD/MM/YYYY')._d;
	}
	$scope.beforeRender = function($view, $dates, $leftDate, $upDate, $rightDate){
		for(var i=0;i<$dates.length;i++){
			var compare = moment($dates[i].utcDateValue);
			if(moment().diff(compare,'days') > 0){
				$dates[i].selectable = false;
			}
		}
	};
	$scope.queryToPass = {};
	$scope.$watch('query.checkIn',function(newVal){
		$scope.queryToPass.checkIn = $filter("date")($scope.query.checkIn,'dd/MM/yyyy');
	});
	$scope.$watch('query.checkOut',function(newVal){
		$scope.queryToPass.checkOut = $filter("date")($scope.query.checkOut,'dd/MM/yyyy');
	});
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
	console.log("we got ",$stateParams.checkIn,moment($stateParams.checkIn,'DD/MM/yyyy')._d);
	console.log("and ",$stateParams.checkOut,moment($stateParams.checkOut,'DD/MM/yyyy')._d);
	$scope.query = {
			address:$stateParams.address,
			country:$stateParams.country,
			city:$stateParams.city,
			administrativeArea:$stateParams.admArea,
			checkIn:checkInTemp,
			checkOut:checkOutTemp,
			guestNumber:parseInt($stateParams.guestNumber)
	};
	console.log("what goes to datepicker::",$scope.query.checkIn);
	$scope.details = {};
	$scope.autoCompleteOptions = {watchEnter:false};
	$scope.$watch('details',function(newVal){
		if(typeof newVal.address_components !== 'undefined'){
			//resetting query object for new location
			$scope.query.locality = "";
			$scope.query.administrativeArea = "";
			$scope.query.country = "";
			for(var i=0; i < newVal.address_components.length; i++){
				var addressType = newVal.address_components[i].types[0];
				if($scope.neededAddressComponents[addressType]){
					$scope.query[$scope.addressAssembler[addressType]] = newVal.address_components[i][$scope.neededAddressComponents[addressType]];
				}
			}
		}
		console.log($scope.details);
		console.log("query: ",$scope.query);
	});
	$scope.properties = PropertyService.property.find($scope.query);
	$scope.$watch('properties',function(){
		console.log("WE GOT EM",$scope.properties);
	});
	$scope.queryProperties = function(query){
		var newUrl = "/queryProperties/"+$scope.query.address+"/"+$scope.query.country+"/"+$scope.query.city+"/"+$scope.query.administrativeArea+"/"+encodeURIComponent(moment($scope.query.checkIn).format('DD/MM/YYYY'))+"/"+encodeURIComponent(moment($scope.query.checkOut).format('DD/MM/YYYY'))+"/"+$scope.query.guestNumber;
		$location.path(newUrl).replace();
		$scope.properties = PropertyService.property.find($scope.query);
	}
	$scope.resetQuery = function(){
		$scope.query.city = "";
		$scope.query.administrativeArea = "";
		$scope.query.country = "";
	}
}]);