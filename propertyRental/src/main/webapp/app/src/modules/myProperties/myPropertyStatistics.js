/**
 * My property statistics module.
 */
var myPropertyStatistics = angular.module("myPropertyStatistics",[]);
myPropertyStatistics.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showMyProperties.detail.statistics",{
		url:"/statistics",
		templateUrl:"modules/myProperties/partials/statistics.html",
		controller:"ShowMyPropertyStatisticsCtrl",
        data : {
        	authorities:['ROLE_USER']
        }
	});
}]);
myPropertyStatistics.controller("ShowMyPropertyStatisticsCtrl",["$scope", "PropertyService","BookingService","$stateParams", function($scope, PropertyService,BookingService,$stateParams){
	$scope.bookedDaysYear = moment().year();
	$scope.avgGuestCountYear = moment().year();
	$scope.avgStarsYear = moment().year();
	$scope.avgBookingsLengthYear = moment().year();
	
	$scope.showPropertyBookedDays = function(selectedYear){
		$scope.propertyBookedDays = new BookingService.propertyBookedDays.query({id:$stateParams.propertyId,year:selectedYear},function(){
			var dataToShow = [];
			for(var i=0;i<$scope.propertyBookedDays.length;i++){
				var month = moment([$scope.bookedDaysYear,$scope.propertyBookedDays[i].month-1]).format("MMMM YYYY");
				dataToShow.push([month,$scope.propertyBookedDays[i].bookedDays]);
			}
			$scope.chartConfigBookedDays = {
				options:{
					title:{
						text:"Amount of booked days by months"
					}
				},
				series:[],
				xAxis:{
					title:{text:"Months"},
					categories:[]
				}
			};
			$scope.chartConfigBookedDays.series.push({name:"Booked days",data:dataToShow});
			$scope.showChart = true;
		});
	};
	
	$scope.showPropertyAvgGuestCount = function(selectedYear){
		$scope.propertyAvgGuestCount = new BookingService.propertyAvgBookingGuestCount.query({id:$stateParams.propertyId,year:selectedYear},function(){
			var dataToShow = [];
			for(var i=0;i<$scope.propertyAvgGuestCount.length;i++){
				var month = moment([$scope.avgGuestCountYear,$scope.propertyAvgGuestCount[i].month-1]).format("MMMM YYYY");
				dataToShow.push([month,$scope.propertyAvgGuestCount[i].averageGuestCount]);
			}
			$scope.chartConfigAvgGuestCount = {
				options:{
					title:{
						text:"Average guest count by months"
					}
				},
				series:[],
				xAxis:{
					title:{text:"Months"},
					categories:[]
				}
			};
			$scope.chartConfigAvgGuestCount.series.push({name:"Average guest count",data:dataToShow});
		});
	};

	$scope.showPropertyAvgStars = function(selectedYear){
		$scope.propertyAvgStars = new BookingService.propertyAvgStars.query({id:$stateParams.propertyId,year:selectedYear},function(){
			var dataToShow = [];
			for(var i=0;i<$scope.propertyAvgStars.length;i++){
				var month = moment([$scope.avgStarsYear,$scope.propertyAvgStars[i].month-1]).format("MMMM YYYY");
				dataToShow.push([month,$scope.propertyAvgStars[i].averageStars]);
			}
			$scope.chartConfigAvgStars = {
				options:{
					title:{
						text:"Property average rating by months"
					}
				},
				series:[],
				xAxis:{
					title:{text:"Months"},
					categories:[]
				}
			};
			$scope.chartConfigAvgStars.series.push({name:"Property average rating",data:dataToShow});
		});
	};
	

	$scope.showBookingsAvgLength = function(selectedYear){
		$scope.bookingsAvgLength = new BookingService.propertyAvgBookingLength.query({id:$stateParams.propertyId,year:selectedYear},function(){
			var bookingAvgLength = [];
			var bookingCount = [];
			for(var i=0;i<$scope.bookingsAvgLength[0].bookingAvgLengthByMonth.length;i++){
				var month = moment([$scope.avgBookingsLengthYear,$scope.bookingsAvgLength[0].bookingAvgLengthByMonth[i].month-1,10]).valueOf();
				bookingAvgLength.push([month,$scope.bookingsAvgLength[0].bookingAvgLengthByMonth[i].averageLength]);
				bookingCount.push([month,$scope.bookingsAvgLength[0].bookingCountByMonth[i].bookingCount]);
			}
			$scope.chartConfigAvgBookingLength = {
				series:[],
				options: {
		            chart: {
		                zoomType: 'x'
		            },
		            rangeSelector: {
		                enabled: false
		            },
		            navigator: {
		                enabled: false
		            }
		        },
		        xAxis: {
		        	title:{text:"Months"},
		            type:"datetime",
		            dateTimeLabelFormats:{
		              month: '%b %Y'
		            }
		          },
				title:{
					text:"Average bookings length and number of bookings by months"
				},
				useHighStocks:true
			};
			$scope.chartConfigAvgBookingLength.series.push(
				{id:1,name:"Booking avg length",data:bookingAvgLength,dataGrouping:{approximation: "sum",
                    enabled: true,
                    forced: true,
                    units: [['month',[1]]]}},
				{id:2,name:"Booking count",data:bookingCount,dataGrouping:{approximation: "sum",
                    enabled: true,
                    forced: true,
                    units: [['month',[1]]]}}
			);
		});
	};
	$scope.showPropertyBookedDays($scope.bookedDaysYear);
	$scope.showPropertyAvgGuestCount($scope.avgGuestCountYear);
	$scope.showPropertyAvgStars($scope.avgStarsYear);
	$scope.showBookingsAvgLength($scope.avgBookingsLengthYear);
}]);