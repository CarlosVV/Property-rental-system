describe('testing property service',function(){
	var API_URL,$httpBackend,PropertyService;
	beforeEach(function(){
		module('RentalApp');
	});
	//I cannot write $httpBackend=$httpBackend that's why using _$httpBackend_
	beforeEach(inject(function(_$httpBackend_,_API_URL_,_PropertyService_){
		$httpBackend = _$httpBackend_;
		API_URL = _API_URL_;
		PropertyService = _PropertyService_;
	}));
	describe('property',function(){
		it('should return same property',function(){ 
			/*
			var url = '/propertyRental/api/properties/1';
			$httpBackend.expectGET(url).respond({id:1});
			var result = PropertyService.property.get({id:1});
			$httpBackend.flush();
			console.log(result);
			expect(result.id).toEqual(1);*/
		});
	});
});