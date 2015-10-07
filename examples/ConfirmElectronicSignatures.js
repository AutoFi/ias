/*

	Examples of using IAS client
	ServiceMethod: ConfirmElectronicSignatures

 */

var IAS = require('../lib/client');
var configs = require('./example.config.json');

var serviceMethod = 'ConfirmElectronicSignatures';

// change the values below to your credentials and dealerId
var loginName = 'TEST';
var loginPassword = 'TEST';
var dealerId = configs.dealerId;
var env = 'test';


// change this value to the pendingContractId you receive after a 
// call to the GenerateElectronicContract method
var pendingContractId = '683496';





// fire up a client
var client = new IAS.Client(loginName, loginPassword, dealerId, env);


// get base data structure
var data = IAS.common.getBaseDataObject(serviceMethod);

// add contract ids to before confirmed
data.contractIds.push(pendingContractId);

var start = new Date().getTime();

// send request and normalize response
client.getData(serviceMethod, data, function(err, result) {
	if (err) {
		console.log('ERROR: ' + err);
	}

	console.log('DONE with ' + serviceMethod + ' in ' + (new Date().getTime() - start) + 'ms');
});


