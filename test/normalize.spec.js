var assert = require('assert');
var xml2js = require('xml2js');
var fs = require('fs');
var path = require('path');


describe('normalize.js', function() {
	var normalize;
	var getRatesXmlJs;
	var contractFormFieldsXmlJs;
	var contractXmlJs;
	var sigLocXmlJs;
	var confirmXmlJs;

	before(function(done) {
		normalize = require('../lib/normalize');
		var n = 0;
		function finish() {
			n++;
			if (n === 4) {
				done();
			}

		}
		var rawxml = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.getRates.xml'));
		var rawxml2 = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.GetElectronicContractFormFields.xml'));
		var rawxml3 = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.GenerateElectronicContract.xml'));
		var rawxml4 = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.GetElectronicContractFormSignatureLocations.xml'));
		var rawxml5 = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.ConfirmElectronicSignatures.xml'));

		xml2js.parseString(rawxml.toString(), function(err, data) {
			getRatesXmlJs = data;
			finish();
		});
		xml2js.parseString(rawxml2.toString(), function(err, data) {
			contractFormFieldsXmlJs = data;
			finish();
		});
		xml2js.parseString(rawxml3.toString(), function(err, data) {
			contractXmlJs = data;
			finish();
		});
		xml2js.parseString(rawxml4.toString(), function(err, data) {
			sigLocXmlJs = data;
			finish();
		});
		xml2js.parseString(rawxml5.toString(), function(err, data) {
			confirmXmlJs = data;
			finish();
		});
	});

	it('should have 5 functions', function() {
		var a = 0;
		Object.keys(normalize).forEach(function(v) {
			if (typeof normalize[v] === 'function') {
				a++;
			}
		});
		assert.equal(a, 5);
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

	describe('.GetElectronicContractFormSignatureLocations', function() {
		
		it('should return valid array', function() {
			var a = normalize.GetElectronicContractFormSignatureLocations(sigLocXmlJs);
			assert.equal(typeof a, 'object', 'is object');
			assert.equal(Object.keys(a).length, 2, 'keys not 1');
			assert.equal(a.G1GMP.buyerSignature.top, 156, '.G1GMP.buyerSignature.top');
		});

		it('should return null with bad data', function() {
			var a = normalize.GetElectronicContractFormSignatureLocations({});
			assert.equal(a, null);
		});
	});


	describe('.GenerateElectronicContract', function() {
		
		it('should return valid array', function() {
			var a = normalize.GenerateElectronicContract(contractXmlJs);
			assert.equal(typeof a, 'object', 'is object');
			assert.equal(Object.keys(a).length, 1, 'keys not 1');
			assert.equal(a.contractFiles.length, 1, '.contractFiles');
		});

		it('should return null with bad data', function() {
			var a = normalize.GenerateElectronicContract({});
			assert.equal(a, null);
		});
	});


	describe('.ConfirmElectronicSignatures', function() {
		var xmljs;
		before(function(done) {
			var xml = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.ConfirmElectronicSignatures.error.xml'));
			xml2js.parseString(xml.toString(), function(err, data) {
				xmljs = data;
				done();
			});
		});
		it('should return valid array', function() {
			var a = normalize.ConfirmElectronicSignatures(confirmXmlJs);
			assert.equal(typeof a, 'object', 'is object');
			assert.equal(a.success, true, '.success');
			
		});

		it('should return null with bad data', function() {
			var a = normalize.ConfirmElectronicSignatures({});
			assert.equal(a, null);
		});

		it('should return error', function() {
			var a = normalize.ConfirmElectronicSignatures(xmljs);
			assert.equal(typeof a, 'object', 'is object');
			assert.equal(a.success, false, '.success');
			
		});
	});

});