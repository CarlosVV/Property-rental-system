describe('Truncate filter unit testing',function(){
	var $filter;
	var truncateFilter;
	var text = "Test me please";
	beforeEach(function(){
		module('RentalApp');
	});
	beforeEach(inject(function(_$filter_){
		$filter = _$filter_;
		truncateFilter = $filter('truncate');
	}));
	it('returns full text if not Show more',function(){
		expect(truncateFilter(text,5,"Show less").length).toEqual(text.length);
	});
	it('returns full text if Show more and length is greater than text',function(){
		expect(truncateFilter(text,500,"Show more").length).toEqual(text.length);
	});
	it('returns truncated text if Show more and length less than text length',function(){
		expect(truncateFilter(text,6,"Show more")).toEqual("Test...");
	});
});