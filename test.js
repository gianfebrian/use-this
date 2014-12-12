var useThis = require("./index");
var should = require("should");
var assert = require("assert");

var requestedFilter = [{
	field: "firstName",
	data: {
		value: "Gian"
	}
}, {
	field: "lastName",
	data: {
		value: "Febrian"
	}
}]

describe("useThis(Object)", function() {
	describe(".checkIsNested('property')", function() {
		it("should return false", function() {
			useThis().checkIsNested("field").should.equal(false);
		});
	});
	describe(".checkIsNested('nested.property')", function() {
		it("should return true", function() {
			useThis().checkIsNested("data.value").should.equal(true);
		});
	});
	describe(".getThis('property')", function() {
		it("should return value of property", function() {
			useThis(requestedFilter).getThis('field', 0).should.equal('firstName');
			useThis(requestedFilter).getThis('field', 1).should.equal('lastName');
			
			useThis().getThis('field', requestedFilter[0]).should.equal('firstName');
			useThis().getThis('field', requestedFilter[1]).should.equal('lastName');
		});
	});
	describe(".getThis('nested.property')", function() {
		it("should return value of nested property", function() {
			useThis(requestedFilter).getThis('data.value', 0).should.equal('Gian');
			useThis(requestedFilter).getThis('data.value', 1).should.equal('Febrian');
			
			useThis().getThis('data.value', requestedFilter[0]).should.equal('Gian');
			useThis().getThis('data.value', requestedFilter[1]).should.equal('Febrian');
		});
	});
	describe(".pluckThis('property')", function() {
		it("should return value of property as array (compared using ('=='))", function() {
			useThis(requestedFilter).pluckThis('field').should.eql(['firstName', 'lastName']);
		});
	});
	describe(".pluckThis('nested.property')", function() {
		it("should return value of property as array (compared using ('=='))", function() {
			useThis(requestedFilter).pluckThis('data.value').should.eql(['Gian', 'Febrian']);
		});
	});
	describe(".pairThese('keyProperty', 'valueProperty')", function() {
		it("should return pair (compared using ('==')", function() {
			useThis(requestedFilter).pairThese('field', 'field')
			.should.eql({firstName: 'firstName', lastName: 'lastName'});
		});
	});
	describe(".pairThese('nested.keyProperty', 'nested.valueProperty')", function() {
		it("should return pair (compared using ('==')", function() {
			useThis(requestedFilter).pairThese('data.value', 'data.value')
			.should.eql({Gian: 'Gian', Febrian: 'Febrian'});
		});
	});
	describe(".pairThese('keyProperty', 'nested.valueProperty')", function() {
		it("should return pair (compared using ('==')", function() {
			useThis(requestedFilter).pairThese('field', 'data.value')
			.should.eql({firstName: 'Gian', lastName: 'Febrian'});
		});
	});
	describe(".pairThese('nested.keyProperty', 'valueProperty')", function() {
		it("should return pair (compared using ('==')", function() {
			useThis(requestedFilter).pairThese('data.value', 'field')
			.should.eql({Gian: 'firstName', Febrian: 'lastName'});
		});
	});
	//Object
	describe(".fillThisTemplate(template, pattern)", function() {
		var template = { possibleNickName: '{data.value}' };
		var pattern1 = { 'data.value': {value: 'propertyValue'}};
		var pattern2 = { 'data.value': {repeat: 3, value: 'propertyValue'}};
		var pattern3 = { 'data.value': {repeat: 3, value: 'iteratee'}};
		it("should return filled template object", function() {
			useThis(requestedFilter).fillThisTemplate(template, pattern1)
			.should.eql([{possibleNickName: 'Gian'}, {possibleNickName: 'Febrian'}]);
		});
		it("should return repeated filled template object", function() {
			useThis(requestedFilter).fillThisTemplate(template, pattern2)
			.should.eql([
				{possibleNickName: 'Gian'}, {possibleNickName: 'Gian'}, {possibleNickName: 'Gian'}, 
				{possibleNickName: 'Febrian'}, {possibleNickName: 'Febrian'}, {possibleNickName: 'Febrian'}
			]);
		});
		it("should return repeated filled template object with index", function() {
			useThis(requestedFilter).fillThisTemplate(template, pattern3)
			.should.eql([
				{possibleNickName: '0'}, {possibleNickName: '1'}, {possibleNickName: '2'}, 
				{possibleNickName: '0'}, {possibleNickName: '1'}, {possibleNickName: '2'}
			]);
		});
	});
});