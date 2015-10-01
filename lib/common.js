/**
 * common values, data and methods
 */

var request = require('request');

var common = module.exports = {};

// service url
common.serviceUrl = 'https://api.iasdirect.com/ElectronicProcessing/ElectronicProcessing.svc';


// enums
common.VehicleUsageTypes = ['NonCommercial', 'Commercial'];
common.VehicleAgeTypes = ['NewVehicle', 'UsedVehicle', 'CertifiedPreownedVehicle'];
common.LimitTireWheelType = ['IncludeAll', 'IncludeNonGoldOnly', 'IncludeGoldOnly'];

// SOAP actions required for request header

common.soapActions = {
	getrates: 'https://api.iasdirect.com/ElectronicProcessing/IElectronicProcessing/GetRates'
	, getelectroniccontractformfields: 'https://api.iasdirect.com/ElectronicProcessing/IElectronicProcessing/GetElectronicContractFormFields'
};

// currently supported web service methods
common.supportedMethods = [
	'GetRates'
	, 'GetElectronicContractFormFields'
];

// service methods that require the dealerId
common.dealerIdRequired = [
	'GetRates'
];

// data stuctures for templates
var baseDataObject = {
	auth: {
		loginName: ''
		, loginPassword: ''
		, userAgent: ''
		, userEmailAddress: ''
		, userId: ''
		, userIPAddress: ''
	}
	, 'getrates': {
		dealerId: ''
		, contractDate: ''
		, limitTireWheel: common.LimitTireWheelType[0]
		, vehicle: {
			ageType: common.VehicleAgeTypes[0]
			, inServiceDate: ''
			, msrp: 0
			, make: ''
			, model: ''
			, mileage: 0
			, nadaRetail: 0
			, purchasePrice: 0
			, trimLevel: ''
			, usageType: common.VehicleUsageTypes[0]
			, vin: ''
			, year: ''
		}
	}
	, 'getelectroniccontractformfields': {
		forms:[]
	}
};


/**
 * 
 * 
 * @param  {string} - name 
 * @return {object} || null
 */
function getBaseDataObject(name) {

	if (!name) {
		return null;
	}
	return baseDataObject[name.toLowerCase()] || null;
}


/**
 * 
 * @param  {string}
 * @param  {string}
 * @param  {string}
 * @param  {Function} (err, response, body)
 */
function sendRequest(url, payload, action, callback) {
	request.post({
		url: url
		, body: payload
		, headers: {
			'Content-Type': 'text/xml;charset=UTF-8;'
			, 'SOAPAction': action
		}
	}, callback);
}



common.getBaseDataObject = getBaseDataObject;
common.sendRequest = sendRequest;