var assert = require('assert');
var xml2js = require('xml2js');
var fs = require('fs');
var path = require('path');


describe('normalize.js', function() {
	var normalize;
	var getRatesXmlJs;
	var contractFormFieldsXmlJs;

	before(function(done) {
		normalize = require('../lib/normalize');
		var n = 0;
		function finish() {
			n++;
			if (n === 2) {
				done();
			}

		}
		var rawxml = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.getRates.xml'));
		var rawxml2 = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.GetElectronicContractFormFields.xml'));
		xml2js.parseString(rawxml.toString(), function(err, data) {
			getRatesXmlJs = data;
			finish();
		});
		xml2js.parseString(rawxml2.toString(), function(err, data) {
			contractFormFieldsXmlJs = data;
			finish();
		});
	});

	it('should have 2 functions', function() {
		var a = 0;
		Object.keys(normalize).forEach(function(v) {
			if (typeof normalize[v] === 'function') {
				a++;
			}
		});
		assert.equal(a, 2);
	});

	describe('.GetRates', function() {
		
		it('should return valid array', function() {
			var a = normalize.GetRates(getRatesXmlJs);

			assert(Array.isArray(a));
			assert.equal(a[0].PlanID, 'C8012', 'planid');
			assert.equal(Object.keys(a[0]).length, 24, 'key length');
		});

		it('should return null with bad data', function() {
			var a = normalize.GetRates({});
			assert.equal(a, null);
		});
	});


	describe('.GetElectronicContractFormFields', function() {
		
		it('should return valid array', function() {
			var a = normalize.GetElectronicContractFormFields(contractFormFieldsXmlJs);

			assert.equal(typeof a, 'object', 'is object');
			assert.equal(Object.keys(a).length, 2, 'keys not 2');
			assert.equal(a.TDWRRKVSCP.DEALERNAME, true, '.DEALERNAME');
		});

		it('should return null with bad data', function() {
			var a = normalize.GetElectronicContractFormFields({});
			assert.equal(a, null);
		});
	});

});