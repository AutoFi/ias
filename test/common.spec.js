var assert = require('assert');

describe('common.js', function() {
	var common;
	before(function() {
		common = require('../lib/common');
	});
	describe('static data', function() {
		it('VehicleUsageTypes should be len 2', function() {
			assert.equal(common.VehicleUsageTypes.length, 2);
		});
		it('VehicleAgeTypes should be len 3', function() {
			assert.equal(common.VehicleAgeTypes.length, 3);
		});
		it('LimitTireWheelType should be len 3', function() {
			assert.equal(common.LimitTireWheelType.length, 3);
		});
	});

	describe('getBaseDataObject', function() {
		it('should be null when invalid name passed', function() {
			var a = common.getBaseDataObject('invalidasdfasdfasdf');
			assert.equal(a, null);
		});
		it('should be null when nothing passed', function() {
			var a = common.getBaseDataObject();
			assert.equal(a, null);
		});

		it('called with auth should be valid', function() {
			var a = common.getBaseDataObject('auth');
			assert(a !== null);
			assert.equal(typeof a.loginName, 'string');
			assert.equal(typeof a.loginPassword, 'string');
			assert.equal(Object.keys(a).length, 6, 'object keys len not 6');
		});

		it('called with getrates should be valid', function() {
			var a = common.getBaseDataObject('getrates');
			assert(a !== null);
			assert.equal(Object.keys(a).length, 4, 'object keys len not 4');
			assert.equal(Object.keys(a.vehicle).length, 12, 'object keys len not 12');
		});

		it('called with getelectroniccontractformfields should be valid', function() {
			var a = common.getBaseDataObject('getelectroniccontractformfields');
			assert(a !== null);
			assert(Array.isArray(a.forms), 'a.forms is not array');
			assert.equal(Object.keys(a).length, 1, 'object keys len not 4');
		});

	});
		
});