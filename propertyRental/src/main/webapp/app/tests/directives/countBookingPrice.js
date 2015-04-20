describe('Count booking price directive unit testing', function() {
  var $compile,
      $rootScope,
      compiledResult;

  // Load the myApp module, which contains the directive
  beforeEach(module('RentalApp'));
  beforeEach(module('myTemplates'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    var checkIn = moment("02/05/2015",'DD/MM/YYYY');
	var checkOut = moment("9/05/2015",'DD/MM/YYYY');
    // Compile a piece of HTML containing the directive
	compiledResult = $compile("<count-booking-price night-price='5' check-in='"+checkIn+"' check-out='"+checkOut+"'></count-booking-price>")($rootScope);
	// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
    $rootScope.$digest();
  }));

  it('Should produce span element', function() {
	// Check that the compiled element contains the templated content
    expect(compiledResult.find("span").length).toEqual(1);
  });
  it('Should calculate property night count and price', function(){
	expect(compiledResult.find("span").html()).toEqual("7 nights - 35 EUR");
  });
});