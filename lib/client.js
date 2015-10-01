'use strict';

// dependencies
var mustache = require('mustache');
var xml2js = require('xml2js');
var async = require('async');

// local dependencies
var common = require('./common');
var templates = require('./templates');
var normalize = require('./normalize');


var exports = module.exports = {};
exports.common = common;
/*

	HELPERS

 */


function handleResponse(resp, body, next) {
	
	// TODO check the response for detailed errors
	if (resp.statusCode !== 200) {
		next('Invalid http statusCode returned (not 200) ' + resp.statusCode);
	} else {
		// check for returned error
		body = body.toString();
		if (body.indexOf('<a:ErrorOccurred>true</a:ErrorOccurred>') > -1){
			var c = /<a:ErrorDescription\b[^>]*>(.*?)<\/a:ErrorDescription>/;
			var d = body.match(c);
			if (d) {
				next(d[1]);
			}
		} else {
			next(null, body.toString());
		}
	}
}


/**
 * Create a client to execute the SOAP requests, parse, extract and normalize the results
 * into js friendly data
 * @param {string} - required
 * @param {string} - required
 * @param {string} - optional but some methods require it
 */
exports.Client = function(loginName, loginPassword, dealerId) {
	if (!loginName) {
		throw new Error('loginName is required');
	} else if (!loginPassword) {
		throw new Error('loginPassword is required');
	}

	this.loginName = loginName;
	this.loginPassword = loginPassword;
	this.dealerId = dealerId || '';
};

exports.Client.prototype.getData = function(serviceMethod, data, callback) {
	var start = new Date().getTime();

	// make sure dealerId is there if necessary

	if (common.dealerIdRequired.indexOf(serviceMethod) > -1) {
		if (!this.dealerId) {
			return callback('dealerId is required for ' + serviceMethod);
		}
	}

	// inject auth data
	data.auth = common.getBaseDataObject('auth');
	data.auth.loginName = this.loginName;
	data.auth.loginPassword = this.loginPassword;
	data.auth.dealerId = this.dealerId;


	// waterfall functions
	function getTemplate(next) {
		templates(serviceMethod, next);
	}

	function doRequest(xmlTemplate, next) {

		// populate template
		var soapPackage = mustache.render(xmlTemplate, data);

		// send request to IAS
		common.sendRequest(common.serviceUrl
			, soapPackage
			, common.soapActions[serviceMethod.toLowerCase()]
			, next);
	}

	function parse(body, next) {
		// parse xml into js
		xml2js.parseString(body, next);
	}

	function extract(raw, next) {
		var result = normalize[serviceMethod](raw);
		next(result === null ? 'Invalid xml response structure' : null, result);
	}

	function finish(err, result) {
		console.log(serviceMethod + ' request completed in ' + (new Date().getTime() - start) + 'ms with ' + (err || 'success'));
		callback(err, result);
	}

	if (common.supportedMethods.indexOf(serviceMethod) === -1) {
		finish('Service method not supported');
	} else {
		async.waterfall([
			getTemplate
			, doRequest
			, handleResponse
			, parse
			, extract
		], finish);
	}

};

