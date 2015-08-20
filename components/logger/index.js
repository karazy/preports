"use strict";

/**
 * Logging module. Wraps the Winston logging module. For error log entries, a unique ID is created,
 * which can be presented to the user in the user interface. 
 */

var winston 	= require('winston');
var uuid 		= require('node-uuid');
var path		= require('path');

var loggingConfig = require('../../config/environment').logging;

module.exports = function () {
	var lconfig = [
		new (winston.transports.File)({ filename: path.resolve(loggingConfig.logFile)})
	];
/*	if (config.runMode === 'dev') {
		lconfig.push(new (winston.transports.Console)({level:'debug'}));
	}*/
	var logger = new (winston.Logger)({
		transports: lconfig
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