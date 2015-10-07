/*

	Examples of using IAS client
	ServiceMethod: GetRates

 */
var fs = require('fs');
var IAS = require('../lib/client');

var configs = require('./example.config.json');

var serviceMethod = 'GetRates';

// change the values below to your credentials and dealerId
var loginName = 'TEST';
var loginPassword = 'TEST';
var dealerId = configs.dealerId;

// fire up a client
var client = new IAS.Client(loginName, loginPassword, dealerId);



// get base data structure
var data = IAS.common.getBaseDataObject(serviceMethod);

data.contractDate = '2015-10-01';

data.limitTireWheel = IAS.common.LimitTireWheelType[0];

data.vehicle.ageType = IAS.common.VehicleAgeTypes[1];
data.vehicle.inServiceDate = '2012-01-01';
data.vehicle.msrp = 0;
data.vehicle.make = 'Audi';
data.vehicle.model = 'A6';
data.vehicle.mileage = 43876;
data.vehicle.nadaRetail = 0;
data.vehicle.purchasePrice = 34995;
data.vehicle.trimLevel = '';
data.vehicle.usageType = IAS.common.VehicleUsageTypes[0];
data.vehicle.vin = 'WAUHGAFC7DN032665';
data.vehicle.year = '2013';


// set start time
var start = new Date().getTime();

// make the call
client.getData(serviceMethod, data, function(err, result) {
	if (err) {
		console.log('Oops. ' + err);
	} else {
		fs.writeFile('_GetRates.json', JSON.stringify(result, null, 4));
	}
	console.log('DONE with ' + serviceMethod + ' in ' + (new Date().getTime() - start) + 'ms');
});
