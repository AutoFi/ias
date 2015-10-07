/*

	Examples of using IAS client
	ServiceMethod: GetElectronicContractFormSignatureLocations
 */

var IAS = require('../lib/client');
var configs = require('./example.config.json');

var serviceMethod = 'GetElectronicContractFormSignatureLocations';

// change the values below to your credentials and dealerId
var loginName = 'TEST';
var loginPassword = 'TEST';
var dealerId = configs.dealerId;
var env = 'test';

// fire up a client
var client = new IAS.Client(loginName, loginPassword, dealerId, env);



// get base data structure
var data = IAS.common.getBaseDataObject(serviceMethod);

// set data values
data.forms.push('G1GMP');


// make the call
client.getData(serviceMethod, data, function(err, result) {
	if (err) {
		console.log('ERROR: ' + err);
	}
	console.log(JSON.stringify(result, null, 4));
});

