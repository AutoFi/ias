# node.js client for IAS Direct web services

IAS allows interaction with their platorm via SOAP.  This client interacts with their SOAP based web services and normalizes the data into easily digestable and readable js objects.  No knowledge of SOAP required :-)

The client uses templates and mustache to inject the data to create the required SOAP envelope.
## Installation

`npm install ias`
## Usage	

Check out the /examples directory

``` javascript
var IAS = require('ias');

// declare your credentials
var loginName = process.env.IAS_LOGINNAME;
var loginPassword = process.env.IAS_LOGINPASSWORD;
var dealerId = process.env.IAS_DEALERID;

// which service method
// serviceMethods are CaSe SenSitIve
var serviceMethod = 'GetPendingElectronicContracts';

// create the client
var client = new IAS.Client(loginName, loginPassword, dealerId);

// retrieve data
client.getData(serviceMethod, function pendingContractsHandler(err, result) {
	if (err) {
		console.log('ERROR: ' + err);
	} else {
		console.log(JSON.stringify(result, null, 4));
	}
});
```

## Considerations
- When passing data to a service method (xml), fields that are optional may be removed from the schema.  This does have a different meaning than leaving the field in the schema and setting it to empty/blank/"".  In other words, including a field in the schema will tell the server to validate it, so a blank/empty value may be parsed as an Int32 or decimal, etc.

## Supported Service Methods

### GetRates

### GenerateElectronicContract

### ConfirmElectronicSignatures

### GetElectronicFormSignatureLocations

### GetElectronicContractFormFields

### GetPendingElectronicContracts

## Limitations

Not all templates will remove the optional elements when a falsy value is set in the data.  Falsy is null, undefined, 0, '' or false