/**
 * common values, data and methods
 */
var debug = require('debug')('ias');
var request = require('request');

var common = module.exports = {};

// service url
common.serviceUrl = 'https://api.iasdirect.com/ElectronicProcessing/ElectronicProcessing.svc';
common.testServiceUrl = 'https://alpha.smartdealerproducts.com/api.iasdirect.com/ElectronicProcessing/ElectronicProcessing.svc';

// enums
common.VehicleUsageTypes = ['NonCommercial', 'Commercial'];
common.VehicleUsageType = {
	nonCommerical: 'NonCommercial'
	, commercial: 'Commercial'
};

common.VehicleAgeTypes = ['NewVehicle', 'UsedVehicle', 'CertifiedPreownedVehicle'];
common.VehicleAgeType = {
	'new': 'NewVehicle'
	, 'used': 'UsedVehicle'
	, 'cpo': 'CertifiedPreownedVehicle'
};

common.LimitTireWheelType = ['IncludeAll', 'IncludeNonGoldOnly', 'IncludeGoldOnly'];
common.MaintenanceKitShipmentTypes = ['ShipToCustomer','ReceivedByCustomer']; // 1, 2

// SOAP actions required for request header

common.soapActions = {
	getrates: 'https://api.iasdirect.com/ElectronicProcessing/IElectronicProcessing/GetRates'
	, getelectroniccontractformfields: 'https://api.iasdirect.com/ElectronicProcessing/IElectronicProcessing/GetElectronicContractFormFields'
	, generateelectroniccontract: 'https://api.iasdirect.com/ElectronicProcessing/IElectronicProcessing/GenerateElectronicContract'
	, getelectroniccontractformsignaturelocations: 'https://api.iasdirect.com/ElectronicProcessing/IElectronicProcessing/GetElectronicContractFormSignatureLocations'
	, confirmelectronicsignatures: 'https://api.iasdirect.com/ElectronicProcessing/IElectronicProcessing/ConfirmElectronicSignatures'
	, getpendingelectroniccontracts: 'https://api.iasdirect.com/ElectronicProcessing/IElectronicProcessing/GetPendingElectronicContracts'
};

// currently supported web service methods
common.supportedMethods = [
	'GetRates'
	, 'GetElectronicContractFormFields'
	, 'GenerateElectronicContract'
	, 'GetElectronicContractFormSignatureLocations'
	, 'ConfirmElectronicSignatures'
	, 'GetPendingElectronicContracts'
];

// service methods that require the dealerId
common.dealerIdRequired = [
	'GetRates'
	, 'GenerateElectronicContract'
	, 'ConfirmElectronicSignatures'
	, 'GetPendingElectronicContracts'
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
	, 'iElectronicProcessingPurchasedPlanType': {
		fiCodeNumber: '',
		form: '',
		formRevisionDate: '',
		isZeroPaymentPlan: '',
		planId: '',
		retailPrice: '',
		term: ''
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
	, 'getelectroniccontractformsignaturelocations': {
		forms:[]
	}
	, 'confirmelectronicsignatures': {
		contractIds: []
		, dealerId: ''
	}
	, 'getpendingelectroniccontracts': {
		dealerId: ''
	}
	, 'generateelectroniccontract': {
		customerInfo: {
			apr: '',
			additionalPayee: '',
			aftermarketHardwareInstallationDate: '',
			aftermarketHardwareRetailPrice: '',
			aftermarketHardwareSerialNumber: '',
			amountFinanced: '',
			balloonAmountOrResidualValue: '',
			buyerDescriptor: {
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
			contractDate: '',
			dealNumber: '',
			etchNumber: '',
			firstPaymentDate: '',
			lenderDescriptor: {
				city: '',
				name: '',
				phone: '',
				state: '',
				street: '',
				zip: ''
			},
			licensedSalesperson: '',
			maintenanceKitShipmentType: '',
			monthlyPayment: '',
			systemModelNumber: '',
			termInMonths: '',
			totalOfPayments: '',
			vscCompany: '',
			vscNumber: '',
			vscTermMiles: '',
			vscTermMonths: '',
			vehicleLoanType: '',
			vehiclePurchaseType: ''
		},
		dealerId: '',
		masterDealerId: '',
		purchasedPlans: [],
		vehicleInfo: {
			ageType: '',
			chromeStyleId: '',
			hasChromeWheels: '',
			hasDealerUpgradedWheelsTires: '',
			hasRunFlatTires: '',
			inServiceDate: '',
			msrp: '',
			make: '',
			mileage: '',
			model: '',
			nadaRetail: '',
			purchasePrice: '',
			trimLevel: '',
			usageType: '',
			vin: '',
			year: ''
		}
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
	debug('Sending request to ' + url);
	request.post({
		url: url
		, body: payload
		, headers: {
			'User-Agent': 'node-ias'
			, 'Content-Type': 'text/xml;charset=UTF-8;'
			, 'SOAPAction': action
			// , 'Accept': 'text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8'
		    // , 'Accept-Encoding': 'gzip,deflate'
		    , 'Accept-Charset': 'utf-8'
		    , 'Connection': 'close'
		    // , 'Host': 'api.iasdirect.com'
		}
	}, function(err, resp, body) {
		callback(err, resp, body);
	});
}



common.getBaseDataObject = getBaseDataObject;
common.sendRequest = sendRequest;