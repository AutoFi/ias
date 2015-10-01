var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');

require = require('really-need');

var request = require('request');

describe('client.js', function() {
	var Client;
	var getRatesXml;
	before(function() {
		Client = require('../lib/client', {bust: true, keep: false});
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
				assert.equal(err, 'Service method not supported');
				done();
			});
		});		
	});

	describe('getData', function() {
		it('should fail with unsupported serviceMethod', function(done) {
			var client = new Client('ln','pw','d');
			client.getData('ASDFASDFASDFASDF', {}, function(err) {
				assert.equal(err, 'Service method not supported');
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

	describe('getData with bad http.statusCode', function() {
		before(function() {
			sinon.stub(request, 'post')
				.yields(null, {statusCode: 500}, '');
		});
		it('should fail', function(done) {
			var client = new Client('name', 'password', '');
			client.getData('GetElectronicContractFormFields', {}, function(err, data) {
				assert.equal(err, 'Invalid http statusCode returned (not 200) 500');
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
				assert.equal(err, 'Invalid xml response structure');
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
});