/*

	Examples of using IAS client
	ServiceMethod: GetPendingElectronicContracts
 */

var IAS = require('../lib/client');
var configs = require('./example.config.json');

var serviceMethod = 'GetPendingElectronicContracts';

// change the values below to your credentials and dealerId
var loginName = 'TEST';
var loginPassword = 'TEST';
var dealerId = configs.dealerId;
var env = 'test';

// fire up a client
var client = new IAS.Client(loginName, loginPassword, dealerId, env);



// no additional data needed
var data = {};

var start = new Date().getTime();
// make the call
client.getData(serviceMethod, data, function(err, result) {
	if (err) {
		console.log('ERROR: ' + err);
	} else {
		console.log(JSON.stringify(result, null, 4));	
	}
	console.log('DONE with ' + serviceMethod + ' in ' + (new Date().getTime() - start) + 'ms');
});

