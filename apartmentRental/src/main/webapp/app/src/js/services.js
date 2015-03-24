/**
 * 
 */
var apartmentService = angular.module("ApartmentService", []);
apartmentService.factory("ApartmentService", [ "$resource", "API_URL",
		function($resource,API_URL) {
			//earlier was: {id : "@id"}
			return $resource(API_URL+'apartments/:id', {}, {
				find:{
					method:"POST",
					isArray:true,//API_URL+"apartments/search/:country/:city/:admArea/:checkIn/:checkOut"
					url:API_URL+"apartments/search"/*,
					params:{
						country:"@country",
						city:"@locality",
						admArea:"@administrative_area_level_1",
						checkIn:"@checkIn",
						checkOut:"@checkOut"
					}*/
				}
			});
		}
	]);