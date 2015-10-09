/*

	Examples of using IAS client
	ServiceMethod: GenerateElectronicContract

 */
var fs = require('fs');
var IAS = require('../lib/client');
var configs = require('./example.config.json');


// change the values below to your credentials and dealerId
var loginName = 'TEST';
var loginPassword = 'TEST';
var dealerId = configs.dealerId;
var env = 'test';
var serviceMethod = 'GenerateElectronicContract';

// fire up a client
var client = new IAS.Client(loginName, loginPassword, dealerId, env);

var data = {
	authentication: {
		loginName: '',
		loginPassword: '',
		userAgent: '',
		userEmailAddress: '',
		userId: '',
		userIpAddress: ''
	},
	customerInfo: {
		apr: '0.12',
		additionalPayee: 'false',
		aftermarketHardwareInstallationDate: '',
		aftermarketHardwareRetailPrice: '0.0',
		aftermarketHardwareSerialNumber: '',
		amountFinanced: '20000',
		balloonAmountOrResidualValue: '0.0',
		buyerDescriptor: {
			cellPhone: '',
			city: 'Menlo Park',
			emailAddress: 'john@doe.com',
			firstName: 'John',
			initial: 'P',
			lastName: 'Doe',
			phone: '415-999-2344',
			state: 'CA',
			street: '673 Partridge Ave.',
			zip: '94025'
		},
		coBuyerDescriptor: {
			cellPhone: '',
			city: '',
			emailAddress: '',
			firstName: '',
			initial: '',
			lastName: '',
			phone: '',
			state: '',
			street: '',
			zip: ''
		},
		contractDate: '2015-10-07',
		dealNumber: 'INTERNALID-' + new Date().getTime(),
		etchNumber: '',
		firstPaymentDate: '2015-11-07',
		lenderDescriptor: {
			city: 'San Francisco',
			name: 'AutoFi',
			phone: '415-555-1212',
			state: 'CA',
			street: '665 3rd ST',
			zip: '94107'
		},
		licensedSalesperson: '',
		maintenanceKitShipmentType: '',
		monthlyPayment: '435.29',
		systemModelNumber: '',
		termInMonths: '60',
		totalOfPayments: '60',
		vscCompany: '',
		vscNumber: '',
		vscTermMiles: '',
		vscTermMonths: '',
		vehicleLoanType: '',
		vehiclePurchaseType: ''
	},
	dealerId: '',
	masterDealerId: '',
	purchasedPlans: [
		{
			fiCodeNumber: '',
			form: 'G1GMP',
			formRevisionDate: '',
			isZeroPaymentPlan: 'false',
			planId: 'P714',
			retailPrice: '409',
			term: '60'
		}, {
			fiCodeNumber: '',
			form: 'WRRPNCXX',
			formRevisionDate: '',
			isZeroPaymentPlan: 'false',
			planId: 'P974',
			retailPrice: '490',
			term: '60'
		}
	],
	vehicleInfo: {
		ageType: IAS.common.VehicleAgeTypes[1],
		chromeStyleId: '0',
		hasChromeWheels: 'false',
		hasDealerUpgradedWheelsTires: 'false',
		hasRunFlatTires: 'false',
		inServiceDate: '2015-01-01',
		msrp: '38000',
		make: 'Audi',
		mileage: '28000',
		model: 'A6',
		nadaRetail: '34995',
		purchasePrice: '34995',
		trimLevel: '',
		usageType: 'NonCommercial',
		vin: 'WAUHGAFC7DN032665',
		year: '2013'
	}
};


// set start time
var start = new Date().getTime();

console.log('Starting ' + serviceMethod + ' service call...');

client.getData(serviceMethod, data, function(err, result) {
	if (err) {
		console.log('ERROR: ' + err);
	} else {
		console.log('Received ' + result.contractFiles.length + ' file(s)');

		for (var i = 0; i < result.contractFiles.length; i++) {
			var file = result.contractFiles[i];
			var name = '_' + file.name;
			console.log('writing out ' + name + ' to disk');
			console.log('ContractId: ' + file.contractId);
			
			fs.writeFileSync(name, file.data, 'base64');
			
		}
	}

	console.log('DONE with ' + serviceMethod + ' in ' + (new Date().getTime() - start) + 'ms');
});
