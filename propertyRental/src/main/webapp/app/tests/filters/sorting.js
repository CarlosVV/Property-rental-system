describe('Sotring filters unit testing',function(){
	var $filter;
	var sortByPriceFilter;
	var testProperties;
	var testPrices;
	beforeEach(function(){
		module('RentalApp');
		testPrices = [
      		{
      			lowerBound:0,
      			upperBound:50
      		},
      		{
      			lowerBound:100,
      			upperBound:150
      		}
		];
		testProperties = [
      		{
      			pricePerNight : 20
      		},
      		{
      			pricePerNight : 40
      		},
      		{
      			pricePerNight : 60
      		},
      		{
      			pricePerNight : 200
      		},
      		{
      			pricePerNight : 120
      		}
      	];
	});
	beforeEach(inject(function(_$filter_){
		$filter = _$filter_;
		sortByPriceFilter = $filter('sortByPrice');
	}));
	describe('sort by type filter',function(){
		it('returns properties with 0<=price<=50 and 100<=price<=150',function(){
			expect(sortByPriceFilter(testProperties,testPrices).length).toEqual(3);
		});
	});
});