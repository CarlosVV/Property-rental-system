describe('testing property service',function(){
	var API_URL,$httpBackend,PropertyService;
	beforeEach(function(){
		module('RentalApp');
	});
	beforeEach(module(function ($urlRouterProvider) {
	    $urlRouterProvider.otherwise(function(){return false;});
	}));
	beforeEach(inject(function(_$httpBackend_,_API_URL_,_PropertyService_){
		$httpBackend = _$httpBackend_;
		API_URL = _API_URL_;
		PropertyService = _PropertyService_;
	}));
	describe('property',function(){
		it('should return list of properties by id',function(){
			var url = API_URL+'properties/myProperties/1';
			$httpBackend.expectGET(url).respond([{id:1}]);
			var result = PropertyService.property.findMyProperties({ownerId:1});
			$httpBackend.flush();
			expect(result.length).toEqual(1);
		});
	});
	afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.resetExpectations();
    });
});