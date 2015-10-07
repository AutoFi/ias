# node.js web client services for IAS (www.iasdirect.com)

IAS allows interaction with their platorm via SOAP.  This client interacts with their SOAP based web services and normalizes the data into easily digestable and readable js objects.  No knowledge of SOAP required :-)

The client uses templates and mustache to inject the data to create the required SOAP envelope.

`npm install ias`

# Considerations
- When passing data to a service method (xml), fields that are optional may be removed from the schema.  This does have a different meaning than leaving the field in the schema and setting it to empty/blank/"".  In other words, including a field in the schema will tell the server to validate it, so a blank/empty value may be parsed as an Int32 or decimal, etc.

# Supported Service Methods

## GetRates

## GenerateElectronicContract

## ConfirmElectronicSignatures

## GetElectronicFormSignatureLocations

## GetElectronicContractFormFields

# Limitations
- coming soon