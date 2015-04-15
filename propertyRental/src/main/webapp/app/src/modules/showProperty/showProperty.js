var showProperty = angular.module("showProperty",[]);
showProperty.config(["$stateProvider",function($stateProvider){
	$stateProvider.state("showProperty",{
		url:"/showProperty/{propertyId}/{checkIn}/{checkOut}/{guestNumber}",
		views:{
			"mainView":{
				templateUrl:"modules/showProperty/partials/showProperty.html",
				controller:"ShowPropertyCtrl"
			}
		},
		params:{
			checkIn:"",
			checkOut:"",
			guestNumber:""
		},
        data : {
            authorities:[],
            pageTitle:"Show property"
        }
	});
}]);
showProperty.controller("ShowPropertyCtrl", ["$scope","PropertyService","$resource","$stateParams","BookingService","$state",function($scope,PropertyService,$resource,$stateParams,BookingService,$state){
	$scope.currentUser = localStorage.getItem('currentUsername');
	$scope.map = { center: { latitude: 0, longitude: 0 }, zoom: 16 };
	$scope.mapOptions = {scrollwheel: false};
	var checkInTemp = undefined;
	var checkOutTemp = undefined;
	if($stateParams.checkIn != "" || $stateParams.checkOut != ""){
		console.log("ok",$stateParams.checkIn);
		checkInTemp = moment($stateParams.checkIn,'DD/MM/YYYY')._d;
		checkOutTemp = moment($stateParams.checkOut,'DD/MM/YYYY')._d;
	}
	console.log(checkInTemp);
	$scope.unavailableDatesBetween = false;
	$scope.booking = new BookingService.booking;
	$scope.booking.checkIn = checkInTemp;
	$scope.booking.checkOut = checkOutTemp;
	$scope.booking.guestNumber = parseInt($stateParams.guestNumber);
	$scope.booking.userAccount = {username:$scope.currentUser};
	$scope.booking.property = {id:$stateParams.propertyId};
	
	$scope.newReview = {};
	$scope.comment = {};
	$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId},function(){
		console.log("WE GOT DEM REVIEWS", $scope.reviews);
	});
	$scope.stars = [1,2,3,4,5];
	$scope.canSendReviews = new PropertyService.reviews.canSendReviews({propertyId:$stateParams.propertyId},function(){
		console.log("soooo",$scope.canSendReviews);
	});
	$scope.reviewToComment = 0;
	$scope.commentReview = function(reviewId){
		if($scope.reviewToComment == reviewId){
			$scope.reviewToComment = 0;
		}else{
			$scope.reviewToComment = reviewId;
		}
	};
	$scope.addReview = function(parentReviewId,formObject){
		if(parentReviewId == 0){
			console.log($scope.newReview);
			if(typeof $scope.newReview.stars !== 'undefined'){
				PropertyService.reviews.save({id:$stateParams.propertyId},$scope.newReview,function(data){
					$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId});
					$scope.newReview = {};
					formObject.$setPristine();
					$scope.starsRequired = false;
				});
			}else{
				$scope.starsRequired = true;
			}
		}else{
			$scope.comment.parentReviewId = parentReviewId;
			console.log($scope.newReview.parentReviewId);
			PropertyService.reviews.save({id:$stateParams.propertyId},$scope.comment,function(data){
				$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId});
				$scope.comment = {};
				$scope.reviewToComment = 0;
				formObject.$setPristine();
			});
		}
	};
	
	console.log($scope.booking);
	/*{
			checkIn:checkInTemp,
			checkOut:checkOutTemp,
			guestNumber:parseInt($stateParams.guestNumber)
	};*/
	$scope.property = new PropertyService.property.get({id:$stateParams.propertyId}, function(){
		$scope.map.center.latitude = $scope.property.latitude;
		$scope.map.center.longitude = $scope.property.longitude;
		$scope.marker = {
				id: 0,
			      coords: {
			        latitude: $scope.property.latitude,
			        longitude: $scope.property.longitude
			      },
			      options: { draggable: false }
		};
		console.log($scope.property);
		$scope.currentIndx = 0;
		$scope.mainImgUrl = $scope.property.imagePaths[0].path;
		$scope.maxGuests = $scope.property.guestCount;
		//for filter
		if($scope.maxLength < $scope.property.description.length){
			$scope.showMoreDesc = "Show more";
		}
		if($scope.maxLength < $scope.property.rules.length){
			$scope.showMoreRules = "Show more";
		}
	});
	$scope.setImg = function(img){
		$scope.mainImgUrl = img.path;
		$scope.currentIndx = $scope.property.imagePaths.indexOf(img);
	}
	$scope.nextImg = function(){
		if($scope.currentIndx == $scope.property.imagePaths.length - 1){
			$scope.setImg($scope.property.imagePaths[0]);
		}else{
			$scope.setImg($scope.property.imagePaths[$scope.currentIndx+1]);
		}
	}
	$scope.prevImg = function(){
		if($scope.currentIndx == 0){
			$scope.setImg($scope.property.imagePaths[$scope.property.imagePaths.length-1]);
		}else{
			$scope.setImg($scope.property.imagePaths[$scope.currentIndx-1]);
		}
	}
	$scope.unavailableDates = new PropertyService.unavailableDates.query({id:$stateParams.propertyId}, function(){
		console.log($scope.unavailableDates);
	});
	$scope.beforeRender = function($view, $dates, $leftDate, $upDate, $rightDate){
		if($scope.unavailableDates.length > 0){
			for(var i=0;i<$dates.length;i++){
				var compare = moment($dates[i].utcDateValue);
				if(moment().diff(compare,'days') < 0){
					for(var j=0;j<$scope.unavailableDates.length;j++){
						var start = moment($scope.unavailableDates[j].startDate);
						var end = moment($scope.unavailableDates[j].endDate);
						if(compare.isBetween(start,end,'day') || compare.isSame(start,'day') || compare.isSame(end,'day')){
							$dates[i].selectable = false;
						}
					}
				}else{
					$dates[i].selectable = false;
				}
			}
		}else{
			console.log("nothing");
		}
	};
	$scope.bookApartment = function(){
		//$scope.booking.userAccount.username = localStorage.getItem("currentUsername");
		console.log("CHEC");
		//part of validation moved here
		var thereAreErrors = false;
		if(!angular.isUndefined($scope.booking.checkOut) && !angular.isUndefined($scope.booking.checkIn)){
			console.log("OKAY");
		   var startDate = moment($scope.booking.checkIn);
		   var endDate = moment($scope.booking.checkOut);
		   var difference = endDate.diff(startDate,'days');
		   console.log("DIF",difference);
		   if(difference >= $scope.property.minimumNights){
				for(var i=0;i<$scope.unavailableDates.length;i++){
					var start = moment($scope.unavailableDates[i].startDate);
					var end = moment($scope.unavailableDates[i].endDate);
					console.log("LOOP",i);
					if(start.isBetween($scope.booking.checkIn,$scope.booking.checkOut) || end.isBetween($scope.booking.checkIn,$scope.booking.checkOut)){
						console.log("YAY");
						thereAreErrors = true;
					}
		    	}
		   }else{
			   //too few days booked!
				thereAreErrors = true;
		   }
		}
		if(!thereAreErrors){
			console.log("should not",$scope.booking);
			$scope.booking.$save();
			$state.go("showMyBookings");
		}else{
			$scope.bookingForm.checkIn.$setValidity("validcheckIn", false);
			$scope.bookingForm.checkOut.$setValidity("validcheckOut", false);
			console.log("ERRORS");
		}
	}
	//filter
	$scope.showMoreDesc = "";
	$scope.showMoreRules = "";
	$scope.maxLength = 100;
	$scope.showMoar = function(whichText){
		var showMore = "Show more";
		var showLess = "Show less";
		if(whichText == 'desc'){
			if($scope.maxLength < $scope.property.description.length){
				if($scope.showMoreDesc == showMore){
					$scope.showMoreDesc = showLess;
				}else{
					$scope.showMoreDesc = showMore;
				}
			}
		}else{
			if($scope.maxLength < $scope.property.description.length){
				if($scope.showMoreRules == showMore){
					$scope.showMoreRules = showLess;
				}else{
					$scope.showMoreRules = showMore;
				}
			}
		}
	};
	//Reviews
	$scope.deleteReview = function(reviewId){
		PropertyService.reviews.remove({id:reviewId}, function(){
			console.log("DELETED");
			$scope.reviews = new PropertyService.reviews.query({id:$stateParams.propertyId});
		});
	};
	$scope.canComment = function(reviewId){
		for (var i = 0; i < $scope.reviews.length; i++) {
			if($scope.reviews[i].parentReviewId == reviewId){
				return false;
			}
		}
		return true;
	};
	
}]);