var assert = require('assert');
var sinon = require('sinon');
var fs = require('fs');

require = require('really-need');

describe('templates.js', function() {
	var templates;
	before(function() {
		templates = require('../lib/templates', {bust: true, keep: false});
		
	});
	describe('failures', function() {
		it('should fail with invalid name passed', function(done) {
			templates('INVALIDasdfasdf', function(err, data) {
				assert.equal(err, 'ENOENT');
				done();
			});
		});

		it('should fail with invalid name passed', function(done) {
			templates(null, function(err, data) {
				assert.equal(err, 'ENOENT');
				done();
			});
		});
	});

	describe('success calls', function() {
		var readData;
		before(function() {
			readData = 'asdfasdf';
			sinon.stub(fs, 'readFile')
				.yields(null, readData);
		});
		after(function() {
			fs.readFile.restore();
		});

		it('should succeed', function(done) {
			templates('GetRates', function(err, data) {

				assert.equal(err, null);
				assert.equal(data, readData);
				assert.equal(fs.readFile.callCount, 1, 'fs was called');
				done();
			});
		});

		it('should succeed from cache', function(done) {
			fs.readFile.reset();
			templates('GetRates', function(err, data) {

				assert.equal(err, null);
				assert.equal(data, readData);
				assert.equal(fs.readFile.callCount, 0, 'fs was called');
				done();
			});
		});
	});

});