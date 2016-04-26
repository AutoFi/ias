var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');

require = require('really-need');

var request = require('request');

describe('client.js', function() {
	var Client;
	var getRatesXml;

	before(function() {
		Client = require('../lib/client', {bust: true, keep: false}).Client;
	});

	describe('constructor', function() {
		it('should fail with no loginName', function(done) {
			assert.throws(function() {
				new Client();
			}, 'loginName is required');
			done();
		});
		it('should fail with no loginPassword', function(done) {
			assert.throws(function() {
				new Client('name');
			}, 'loginPassword is required');
			done();
		});
	});

	describe('getData', function() {
		it('should fail with unsupported serviceMethod', function(done) {
			var client = new Client('ln','pw','d');
			client.getData('ASDFASDFASDFASDF', {}, function(err) {
				assert.equal(err.message, 'Service method not supported');
				done();
			});
		});
		it('should fail with no dealerId when it is required', function(done) {
			var client = new Client('ln','pw');
			client.getData('GetRates', {}, function(err) {
				assert.equal(err, 'dealerId is required for GetRates');
				done();
			});
		});
	});

	describe('getData with bad http.statusCode no body', function() {
		before(function() {
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 500}, '');
		});
		it('should fail', function(done) {
			var client = new Client('name', 'password', '');
			client.getData('GetElectronicContractFormFields', {}, function(err, data) {
				assert.equal(err.message, 'Invalid http statusCode returned (not 200) 500');
				done();
			});
		});

		after(function() {
			request.post.restore();
		});
	});

	describe('getData with bad http.statusCode with body but no faultstring', function() {
		before(function() {
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 500}, '<a></a>');
		});
		it('should fail', function(done) {
			var client = new Client('name', 'password', '');
			client.getData('GetElectronicContractFormFields', {}, function(err, data) {
				assert.equal(err.message, 'Invalid http statusCode returned (not 200) 500');
				done();
			});
		});

		after(function() {
			request.post.restore();
		});
	});


	describe('getData with IAS fault returned', function() {
		before(function() {
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 500}, '<a><b><faultstring>There was a fault</faultstring></b></a>');
		});
		it('should fail', function(done) {
			var client = new Client('name', 'password', '');
			client.getData('GetElectronicContractFormFields', {}, function(err, data) {
				assert.equal(err.message, 'There was a fault');
				done();
			});
		});

		after(function() {
			request.post.restore();
		});
	});


	describe('getData with IAS returned handled error', function() {
		var xml;
		before(function() {
			xml = fs.readFileSync(__dirname + '/data/data.ias.xml.caughtError.xml');
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 200}, xml);
		});

		it('should fail', function(done) {
			var client = new Client('name', 'password', '');
			client.getData('GetElectronicContractFormFields', {}, function(err, data) {
				assert.equal(err.message, 'Invalid login credentials.');
				done();
			});
		});

		after(function() {
			request.post.restore();
		});
	});

	describe('getData with IAS returned handled error with no description', function() {
		var xml;
		before(function() {
			xml = fs.readFileSync(__dirname + '/data/data.ias.xml.caughtError2.xml');
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 200}, xml);
		});

		it('should fail', function(done) {
			var client = new Client('name', 'password', '');
			client.getData('GetElectronicContractFormFields', {}, function(err, data) {
				assert.equal(err.message, 'ErrorOccurred was returned from server, but no description.');
				done();
			});
		});

		after(function() {
			request.post.restore();
		});
	});

	describe('getData with unsupported xml structure', function() {
		before(function() {
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 200}, '<x></x>');
		});
		it('should fail', function(done) {
			var client = new Client('name', 'password', '');
			client.getData('GetElectronicContractFormFields', {}, function(err, data) {
				assert.equal(err.message, 'Invalid xml response structure');
				done();
			});
		});

		after(function() {
			request.post.restore();
		});
	});

	describe('GetElectronicContractFormFields', function() {
		var xml;
		before(function() {
			xml = fs.readFileSync(__dirname + '/data/data.ias.xml.GetElectronicContractFormFields.xml');
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 200}, xml);
		});

		it('should be successful', function(done) {
			var client = new Client('name', 'password', '');
			client.getData('GetElectronicContractFormFields', {}, function(err, data) {
				if (err) {
					console.log(err);
				}
				assert(!err);
				done();
			});
		});

		after(function() {
			request.post.restore();
		});
	});

	describe('GetRates', function() {
		var xml;
		before(function() {
			xml = fs.readFileSync(__dirname + '/data/data.ias.xml.getRates.xml');
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 200}, xml);
		});

		it('should be successful', function(done) {
			var client = new Client('name', 'password', 'dealerid');
			client.getData('GetRates', {}, function(err, data) {
				if (err) {
					console.log(err);
				}
				assert(!err);
				done();
			});
		});
		
		after(function() {
			request.post.restore();
		});
	});

	describe('GenerateElectronicContract', function() {
		var xml;
		before(function() {
			xml = fs.readFileSync(__dirname + '/data/data.ias.xml.GenerateElectronicContract.xml');
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 200}, xml);
		});

		it('should be successful with test env', function(done) {
			var client = new Client('name', 'password', 'dealerid', 'test');
			client.getData('GenerateElectronicContract', {}, function(err, data) {
				if (err) {
					console.log(err);
				}
				assert(!err);
				assert.equal(request.post.args[0][0].url, 'https://alpha.smartdealerproducts.com/api.iasdirect.com/ElectronicProcessing/ElectronicProcessing.svc', 'test url');
				assert.equal(data.contractFiles.length, 1, '.contractFiles len');
				assert.equal(data.contractFiles[0].contractId, '683723', 'contractId');
				done();
			});
		});
		
		after(function() {
			request.post.restore();
		});
	});


	describe('GetElectronicContractFormSignatureLocations', function() {
		var xml;
		before(function() {
			xml = fs.readFileSync(__dirname + '/data/data.ias.xml.GetElectronicContractFormSignatureLocations.xml');
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 200}, xml);
		});

		it('should be successful', function(done) {
			var client = new Client('name', 'password', 'dealerid');
			client.getData('GetElectronicContractFormSignatureLocations', {}, function(err, data) {
				if (err) {
					console.log(err);
				}
				assert(!err);
				done();
			});
		});
		
		after(function() {
			request.post.restore();
		});
	});
});