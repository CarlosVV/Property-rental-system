describe('ShowPropertyCtrl controller unit testing',function(){
	var API_URL, $httpBackend, scope, $controller;
	var stateParams = {propertyId:1};
	beforeEach(function(){
		module('RentalApp');
	});
	beforeEach(module(function ($urlRouterProvider) {
	    $urlRouterProvider.otherwise(function(){return false;});
	}));
	beforeEach(inject(function(_$controller_,$rootScope,_$httpBackend_,_API_URL_){
		$controller = _$controller_;
		$httpBackend = _$httpBackend_;
		API_URL = _API_URL_;
		scope = $rootScope.$new();
		$controller('ShowPropertyCtrl',{$scope:scope,$stateParams:stateParams});
		
		$httpBackend.when('GET',API_URL+'properties/reviews/1').respond([{id:1}]);
		$httpBackend.when('GET',API_URL+'bookings/canSendReviews/1').respond({can:true});
		$httpBackend.when('GET',API_URL+'properties/1').respond({id:1,description:"descriptions",rules:"rules",imagePaths:[{path:"img1.jpg"},{path:"img2.jpg"},{path:"img3.jpg"}]});
		$httpBackend.when('GET',API_URL+'bookings/unavailableDates/1').respond([{date:'27/06/15'}]);

		$httpBackend.flush();
	}));
	describe('$scope.mainImgUrl initial value',function(){
		it('should set first image as main image',function(){
			expect(scope.mainImgUrl).toEqual("img1.jpg");
		});
	});
	describe('$scope.nextImg',function(){
		it('should set second image as main image',function(){
			scope.nextImg();
			expect(scope.mainImgUrl).toEqual("img2.jpg");
		});
	});
	describe('$scope.prevImg',function(){
		it('should set third image as main image',function(){
			scope.prevImg();
			expect(scope.mainImgUrl).toEqual("img3.jpg");
		});
	});
});