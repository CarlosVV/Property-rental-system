describe('ShowPropertyCtrl controller unit testing',function(){
	var scope = {};
	beforeEach(function(){
		module('RentalApp');
	});
	var $controller;
	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
		$controller('ShowPropertyCtrl',{$scope:scope});
	}));
	describe('$scope.commentReview',function(){
		it('sets current review to comment',function(){
			scope.commentReview(1);
			expect(scope.reviewToComment).toEqual(1);
		});
	});
});