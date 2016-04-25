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
			if (n === 5) {
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

	it('should have 7 functions', function() {
		var a = 0;
		Object.keys(normalize).forEach(function(v) {
			if (typeof normalize[v] === 'function') {
				a++;
			}
		});
		assert.equal(a, 7);
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
		var xmljs;
		before(function(done) {
			var xml = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.GenerateElectronicContract.nofiles.xml'));
			xml2js.parseString(xml.toString(), function(err, data) {
				xmljs = data;
				done();
			});
		});
		it('should return valid array', function() {
			var a = normalize.GenerateElectronicContract(contractXmlJs);
			assert.equal(typeof a, 'object', 'is object');
			assert.equal(Object.keys(a).length, 1, 'keys not 1');
			assert.equal(a.contractFiles.length, 1, '.contractFiles');
			assert.equal(a.contractFiles[0].form, 'G1GMP', 'form name');
		});

		it('should handle no contracts returned', function() {
			var a = normalize.GenerateElectronicContract(xmljs);
			assert.equal(typeof a, 'object', 'is object');
			assert.equal(Object.keys(a).length, 1, 'keys not 1');
			assert.equal(a.contractFiles.length, 0, '.contractFiles');
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


	describe('.GetPendingElectronicContracts', function() {
		var xmljs;
		before(function(done) {
			var xml = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.GetPendingElectronicContracts.xml'));
			xml2js.parseString(xml.toString(), function(err, data) {
				xmljs = data;
				done();
			});
		});
		it('should return valid array', function() {
			var a = normalize.GetPendingElectronicContracts(xmljs);
			assert.equal(typeof a, 'object', 'is object');
			assert.equal(Object.keys(a).length, 1, 'keys not 1');
			assert.equal(a.contractFiles.length, 1, '.contractFiles');
		});

		it('should return null with bad data', function() {
			var a = normalize.GetPendingElectronicContracts({});
			assert.equal(a, null);
		});
	});

	describe('.GenerateElectronicRemittanceBatch', function() {
		var xmljs1, xmljs2, xmlerrorjs, xml1, xml2, xmlerror;
		before(function(done) {
			var xmlerror = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.GenerateElectronicRemittanceBatch.error.xml'));
			var xml2 = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.GenerateElectronicRemittanceBatch.xml'));
			var xml1 = fs.readFileSync(path.resolve(__dirname, 'data/data.ias.xml.GenerateElectronicRemittanceBatch-single.xml'));
			var n = 0;
			function fin(){
				n++;
				if (n === 3) {
					done();
				}
			}
			xml2js.parseString(xmlerror.toString(), function(err, data) {
				xmlerrorjs = data;
				fin();
			});
			xml2js.parseString(xml1.toString(), function(err, data) {
				xmljs1 = data;
				fin();
			});
			xml2js.parseString(xml2.toString(), function(err, data) {
				xmljs2 = data;
				fin();
			});

		});
		it('should return valid array with 2 batches', function() {
			var a = normalize.GenerateElectronicRemittanceBatch(xmljs2);
			assert.equal(typeof a, 'object', 'is object');
			assert.equal(a.success, true, '.success');
			assert.equal(a.batches.length, 2, 'batches len');
			assert.deepEqual(a.batches[0], {
      "BatchID": "A-56904"
      , "BatchMailTo": "Innovative Aftermarket Systems, L.P."
      , "BatchMailToAddress": "12800 Angel Side Drive"
      , "BatchMailToCity": "Leander"
      , "BatchMailToState": "TX"
      , "BatchMailToZip": "78641"
      , "BatchPayee": "Innovative Aftermarket Systems, L.P."
      , "BatchPayeeAddress": "12800 Angel Side Drive"
      , "BatchPayeeCity": "Leander"
      , "BatchPayeeState": ""
      , "BatchPayeeZip": "78641"
      , "ContractCount": "2"
      , "DealerReferenceNumber": ""
      , "TotalDealerRemit": "431.5"
}
, 'data');
		});
		it('should return valid array a single batch', function() {
			var a = normalize.GenerateElectronicRemittanceBatch(xmljs1);
			assert.equal(typeof a, 'object', 'is object');
			assert.equal(a.success, true, '.success');
			assert.equal(a.batches.length, 1, 'batches len');
			assert.deepEqual(a.batches[0], {
      "BatchID": "A-56904"
      , "BatchMailTo": "Innovative Aftermarket Systems, L.P."
      , "BatchMailToAddress": "12800 Angel Side Drive"
      , "BatchMailToCity": "Leander"
      , "BatchMailToState": "TX"
      , "BatchMailToZip": "78641"
      , "BatchPayee": "Innovative Aftermarket Systems, L.P."
      , "BatchPayeeAddress": "12800 Angel Side Drive"
      , "BatchPayeeCity": "Leander"
      , "BatchPayeeState": ""
      , "BatchPayeeZip": "78641"
      , "ContractCount": "2"
      , "DealerReferenceNumber": ""
      , "TotalDealerRemit": "431.5"
}
, 'data');
		});

		it('should return error with bad data', function() {
			var a = normalize.GenerateElectronicRemittanceBatch({});
			assert.equal(a.success, false, '.success');
			assert.equal(a.message, 'TypeError: Cannot read property \'s:Body\' of undefined', '.message');
			
		});

		it('should return error', function() {
			var a = normalize.GenerateElectronicRemittanceBatch(xmlerrorjs);
			assert.equal(typeof a, 'object', 'is object');
			assert(!a.success, '.success');
			
		});
	});


});