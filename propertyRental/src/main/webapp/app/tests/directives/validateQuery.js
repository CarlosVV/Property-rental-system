describe('Count booking price directive unit testing', function() {
  var $compile,
      $rootScope,
      compiledResult,
      form;

  // Load the myApp module, which contains the directive
  beforeEach(module('RentalApp'));
  beforeEach(module('myTemplates'));

  // Store references to $rootScope and $compile
  // so they are available to all tests in this describe block
  beforeEach(inject(function(_$compile_, _$rootScope_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    var element = angular.element("<form name='form'><input type='text' name='queryInput' validateQuery='{{country}}' ng-model='query'/></form>");
    // Compile a piece of HTML containing the directive
	compiledResult = $compile(element)($rootScope);
	$rootScope.query = 'abc';
	$rootScope.country = 'nothing';
	form = $rootScope.form;
  }));
  it('Should be valid input', function() {
  	// Check that the compiled element contains the templated content
    $rootScope.query = 'Country name';
	$rootScope.country = 'Whatever country';
    form.queryInput.$setViewValue('Whatever city');
	// fire all the watches, so the scope expression {{1 + 1}} will be evaluated
    $rootScope.$digest();
    expect($rootScope.query).toEqual("Whatever city");
    expect(form.queryInput.$valid).toBe(true);
  });
});