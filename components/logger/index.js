"use strict";

/**
 * Logging module. Wraps the Winston logging module. For error log entries, a unique ID is created,
 * which can be presented to the user in the user interface. 
 */

var winston 	= require('winston');
var uuid 		= require('uuid');
var path		= require('path');
var config		= require('../../config/environment');

module.exports = function (callingModule) {

	var logger = new winston.Logger({
	    level: getLogLevel(),
    	transports: [
      		new (winston.transports.Console)({
      			prettyPrint: true,
  				colorize: true,
  				silent: false,
  				timestamp: true,
  				label: getLabel(callingModule)
/*      			timestamp: function() {
        			return (new Date()).toISOString();
      			},
      			formatter: function(options) {
        		// Return string will be passed to logger.
        		return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
          			(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
      			}*/
      		})
    	]
  	});
	
	var _errorLogger = logger.error;
	logger.error = function (msg, customData) {
		var errorId = uuid.v1();
		if (typeof  customData === 'object') {
			customData.errorId = errorId;
		} else {
			customData = {
				errorId: errorId
			};
		}
		_errorLogger.call(logger, msg, customData);
		return errorId;
	};

	return logger;
}();

/*
* Returns the log level.
* @return loglevel as specified in config. Defaults to info.
*/
function getLogLevel() {
	if(config && config.logging && config.logging.level) {
		return config.logging.level;
	}

	return 'info';
}

function getLabel(callingModule) {
	if(!callingModule) {
		return '';
	}

    var parts = callingModule.filename.split('/');
    return parts[parts.length - 2] + '/' + parts.pop();
};