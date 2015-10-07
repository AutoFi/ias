/*
	This module take xml2js data and normalizes it into well formed data
 */

var _ = require('lodash');
var debug = require('debug')('ias');
var normalize = module.exports = {};


/**
 * Converts the xml2js IAS RateType (product) to a simple object while stripping the : from the keys
 * @param p {object} - the xml2js version of a ratetype (product)
 */
function scrubber(p) {
	var ret = {};
	_.each(p, function(v, k) {
		ret[k.replace('a:','')] = typeof v[0] === 'string' ? v[0] : '';
	});
	return ret;
}



/**
* extract the GetRates products from the xml2js soap response
* @params soapEnvelopeJs {object} - soap xml converted to js via xml2js
*/
function extractProducts(soapEnvelopeJs) {
	var productsRaw = [];
	var normalizedProducts = [];

	try {
		productsRaw = soapEnvelopeJs['s:Envelope']['s:Body'][0].GetRatesResponse[0].GetRatesResult[0]['a:Rates'][0]['a:Common.RateType'];
	} catch (ex) {
		return null;
	}

	productsRaw.forEach(function(v) {
		var p = scrubber(v);
		normalizedProducts.push(p);
	});
	
	

	return normalizedProducts;
}


function extractFormFields(soapEnvelopeJs) {
	var result = {};
	try {
		var forms = soapEnvelopeJs['s:Envelope']['s:Body'][0]
			.GetElectronicContractFormFieldsResponse[0]
			.GetElectronicContractFormFieldsResult[0]['a:FormFieldsListings'][0]['a:IElectronicProcessing.FormFieldsListingType'];

		
		forms.forEach(function(v, k) {
			var name = v['a:FormName'][0];
			var fields = v['a:FormFields'][0]['a:IElectronicProcessing.FormFieldType'];
			result[name] = {};

			fields.forEach(function(v) {
				var fieldName = v['a:Name'][0];
				var required = v['a:IsRequired'][0];
				result[name][fieldName] = required === 'true';
			});
		});
	} catch (ex) {
		result = null;
	}

	return result;
}

function extractContracts(soapEnvelopeJs) {
	var result = {contractFiles: []};
	try {
		var forms = soapEnvelopeJs['s:Envelope']['s:Body'][0]
			.GenerateElectronicContractResponse[0]
			.GenerateElectronicContractResult[0]
			['a:ElectronicContracts'][0]
			['a:IElectronicProcessing.PendingElectronicContractType'];

		
		forms.forEach(function(v, k) {
			var pdfData = v['a:PDFData'][0];
			var name = v['a:PDFFileName'][0];
			var contractId = v['a:PendingElectronicContractID'][0];

			result.contractFiles.push({name: name, data: pdfData, contractId: contractId});
		});
	} catch (ex) {
		// console.log(ex);
		result = null;
	}

	return result;
}


function extractGetElectronicContractFormSignatureLocations(soapEnvelopeJs) {
	var result = {};
	try {
		var forms = soapEnvelopeJs['s:Envelope']['s:Body'][0]
			.GetElectronicContractFormSignatureLocationsResponse[0]
			.GetElectronicContractFormSignatureLocationsResult[0]
			['a:FormSignatureLocations'][0]
			['a:IElectronicProcessing.FormSignatureLocationType'];

		
		forms.forEach(function(v, k) {
			var name = v['a:Form'][0];
			var locations = {
				buyerSignature: {top:-1, right: -1, bottom: -1, left: -1}
				, dealerSignature: {top:-1, right: -1, bottom: -1, left: -1}
				, cobuyerSignature: {top:-1, right: -1, bottom: -1, left: -1}
			};
			var tokens = ['a:BuyerSignature', 'a:DealerSignature','a:CobuyerSignature'];
			var locs = ['Top','Right','Bottom','Left'];
			_.each(tokens, function(prefix) {
				_.each(locs, function(pos) {
					var prop = _.camelCase(prefix.replace('a:',''));
					// if (locations[prop][pos.toLowerCase()] !== undefined) {
						locations[prop][pos.toLowerCase()] = parseInt(v[prefix + pos][0]);
					// }
				});
			});

			result[name] = locations;
		});
	} catch (ex) {
		console.log(ex);
		result = null;
	}

	return result;
}


function extractConfirmElectronicSignatures(soapEnvelopeJs) {
	var result = {success: false};
	try {
		var data = soapEnvelopeJs['s:Envelope']['s:Body'][0]
			.ConfirmElectronicSignaturesResponse[0]
			.ConfirmElectronicSignaturesResult[0];

		if (data['a:ErrorOccurred'][0] == 'false') {
			result.success = true;
		}
	} catch (ex) {
		// console.log(ex);
		result = null;
	}

	return result;
}


normalize.GetRates = extractProducts;
normalize.GetElectronicContractFormFields = extractFormFields;
normalize.GenerateElectronicContract = extractContracts;
normalize.GetElectronicContractFormSignatureLocations = extractGetElectronicContractFormSignatureLocations;
normalize.ConfirmElectronicSignatures = extractConfirmElectronicSignatures;

