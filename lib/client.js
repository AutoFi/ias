'use strict';

// dependencies
var mustache = require('mustache');
var xml2js = require('xml2js');
var async = require('async');
var debug = require('debug')('ias');

// local dependencies
var common = require('./common');
var templates = require('./templates');
var normalize = require('./normalize');


var exports = module.exports = {};
exports.common = common;


/*

	HELPERS

*/




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

/**
 * Used to make the soap request and normalize data for all supported service methods
 * @param  {string}   serviceMethod - see common.supportedServiceMethods 
 * @param  {object}   data          object literal for data required for the method
 * @param  {Function} callback      (err {string}, data {object || array}) 
 */
exports.Client.prototype.getData = function(serviceMethod, data, callback) {
	var start = new Date().getTime();
	var requestBody = null;
	var responseBody = null;

	// make sure dealerId is there if necessary
	if (common.dealerIdRequired.indexOf(serviceMethod) > -1) {
		if (!this.dealerId) {
			return callback('dealerId is required for ' + serviceMethod);
		} else {
			data.dealerId = this.dealerId;
		}
	}

	// inject auth data
	data.authentication = common.getBaseDataObject('auth');
	data.authentication.loginName = this.loginName;
	data.authentication.loginPassword = this.loginPassword;


	debug('data being passed:');
	debug(JSON.stringify(data, null, 4));

	// waterfall functions
	function getTemplate(next) {
		templates(serviceMethod, next);
	}

	function doRequest(xmlTemplate, next) {

		// TODO request logging

		// populate template
		var soapPackage = mustache.render(xmlTemplate, data);
		requestBody = soapPackage;

		debug(soapPackage);

		// send request to IAS
		common.sendRequest(common.serviceUrl
			, soapPackage
			, common.soapActions[serviceMethod.toLowerCase()]
			, next);
	}


	function handleResponse(resp, body, next) {
		
		responseBody = body;

		// check for non-200 http status
		if (resp.statusCode !== 200) {
			debug('handleResponse bad http code: ' + resp.statusCode);
			debug(body.toString());

			var errMsg = 'Invalid http statusCode returned (not 200) ' + resp.statusCode;
			if (body) {
				var em = body.toString().match(/<faultstring\b[^>]*>(.*?)<\/faultstring>/);
				errMsg = em ? em[1] : errMsg;
			}
			
			next(errMsg);
		} else {
			// check for returned error
			body = body.toString();
			if (body.indexOf('<a:ErrorOccurred>true</a:ErrorOccurred>') > -1){
				var c = /<a:ErrorDescription\b[^>]*>(.*?)<\/a:ErrorDescription>/;
				var d = body.match(c);
				if (d) {
					next(d[1]);
				} else {
					next('ErrorOccurred was returned from server, but no description.');
				}
			} else {
				next(null, body.toString());
			}
		}
	}

	function parse(body, next) {
		debug(body);
		// parse xml into js
		xml2js.parseString(body, next);
	}

	function extract(raw, next) {
		debug(JSON.stringify(raw));
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

