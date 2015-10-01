/*

	Examples of using IAS client

 */


// dependencies
var fs = require('fs');
var IAS = require('./lib/client');



/**
 * Your authentication details
 * Some methods require the dealerId, while others don't
 *
 * In production, you should use env variables
 */

// CHANGE THESE!!!!
var loginName = 'TEST';
var loginPassword = 'TEST';
var dealerId = process.env.DEALER_ID || '';





// fire up a client
var client = new IAS.Client(loginName, loginPassword, dealerId);

var serviceMethod = '';
var start;



/**
 * GetElectronicContractFormFields
 * data object
 * {
 * 	forms:[{string}] // string = form name
 * }
 */

serviceMethod = 'GetElectronicContractFormFields';

start = new Date().getTime();

var data = IAS.common.getBaseDataObject(serviceMethod);
data.forms.push('IN1ACCXX');

client.getData(serviceMethod, data, function(err, result) {
	if (err) {
		console.log('Oops. ' + err);
	} else {
		fs.writeFile('_' + serviceMethod + '.json', JSON.stringify(result, null, 4));
	}
	console.log('DONE with ' + serviceMethod + ' in ' + (new Date().getTime() - start) + 'ms');
});



var data = IAS.common.getBaseDataObject('GetRates');

client.getData('GetRates', data, function(err, result) {
	if (err) {
		console.log('Oops. ' + err);
	} else {
		fs.writeFile('_' + serviceMethod + '.json', JSON.stringify(result, null, 4));
	}
	console.log('DONE');
});