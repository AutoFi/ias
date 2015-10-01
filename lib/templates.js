'use strict';

// dependencies
var fs = require('fs');
var path = require('path');


/**
 * used for repeated access to avoid IO after first read
 * @type {Object}
 */
var templateCache = {};

/**
* Get a soap envelope template from cache or disk
* @params name {string} - name of web service routing associated with template
* @params callback {function} (error, string)
*/
function get(name, callback) {
	// check cache
	if (!templateCache[name]) {
		// get tmpl from disk
		fs.readFile(path.resolve(__dirname, 'templates/' + name + '.xml.tmpl'), function(err, raw) {
			if (!err) {
				// store the tmpl in the cache
				templateCache[name] = raw.toString();
			}
			callback(err ? err.code : null, raw ? raw.toString() : null);
		});
	} else {
		
		callback(null, templateCache[name]);
	}
	// or get from disk
}

module.exports = get;