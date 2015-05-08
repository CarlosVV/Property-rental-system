
var propertyFilters = angular.module("SortingFilters", []);
propertyFilters.filter('sortByFacility', function(){
	return function(properties,facilities){
		if(!angular.isUndefined(properties) && facilities.length > 0){
			var result = [];
			var amountOfFacilitiesToFind = facilities.length;
			for(var i=0;i<properties.length;i++){
				var foundFacilities = 0;
				for(var j=0;j<facilities.length;j++){
					for(var k=0;k<properties[i].propertyFacilities.length;k++){
						if(properties[i].propertyFacilities[k].id == facilities[j].id){
							foundFacilities++;
							if(foundFacilities == amountOfFacilitiesToFind){
								break;
							}
						}
					}
					if(foundFacilities == amountOfFacilitiesToFind){
						break;
					}
				}
				if(foundFacilities == amountOfFacilitiesToFind){
					result.push(properties[i]);
				}
			}
			return result;
		}
		return properties;
	};
});
propertyFilters.filter('sortByType',function(){
	return function(properties,types){
		if(!angular.isUndefined(properties) && types.length > 0){
			var result = [];
			for(var i=0;i<properties.length;i++){
				var acceptable = false;
				for(var j=0;j<types.length;j++){
					if(properties[i].propertyType == types[j].name){
						acceptable = true;
						break;
					}
				}
				if(acceptable){
					result.push(properties[i]);
				}
			}
			return result;
		}
		return properties;
	};
});
propertyFilters.filter('sortByPrice',function(){
	return function(properties,prices){
		if(!angular.isUndefined(properties) && prices.length > 0){
			var result = [];
			for(var i=0;i<properties.length;i++){
				var acceptable = false;
				for(var j=0;j<prices.length;j++){
					if(properties[i].pricePerNight >= prices[j].lowerBound && 
							(typeof prices[j].upperBound === 'undefined' || 
									properties[i].pricePerNight <= prices[j].upperBound)){
						acceptable = true;
						break;
					}
				}
				if(acceptable){
					result.push(properties[i]);
				}
			}
			return result;
		}
		return properties;
	};
});
propertyFilters.filter('sortByYearBooking',function(){
	return function(bookings,year){
		if(!angular.isUndefined(bookings) && !angular.isUndefined(year) && year != ""){
			var result = [];
			for(var i=0;i<bookings.length;i++){
				var createdYear = moment(bookings[i].bookedDate).year();
				if(createdYear == year){
					result.push(bookings[i]);
				}
			}
			return result;
		}
		return bookings;
	}
});
propertyFilters.filter('sortByCheckInBooking',function(){
	return function(bookings,year){
		if(!angular.isUndefined(bookings) && !angular.isUndefined(year) && year != ""){
			var result = [];
			for(var i=0;i<bookings.length;i++){
				var checkInYear = moment(bookings[i].checkIn).year();
				if(checkInYear == year){
					result.push(bookings[i]);
				}
			}
			return result;
		}
		return bookings;
	}
});
propertyFilters.filter('startFrom',function(){
	return function (input, start) {
		if(!angular.isUndefined(input)){
			return input.slice(start);
		}
    };
});