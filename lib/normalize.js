/*
	This module take xml2js data and normalizes it into well formed data
 */

var _ = require('lodash');

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

normalize.GetRates = extractProducts;
normalize.GetElectronicContractFormFields = extractFormFields;

