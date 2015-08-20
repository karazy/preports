"use strict";

/**
 * Session management module. Currently it is used to clean up expired in memory sessions. 
 * At this point we don't want to use Redis or MongoDB
 * The cleanup happens once every hour.
 */
var logger = require('../logger');
var CronJob = require('cron').CronJob;

module.exports = function (sessionStore) {
	var sessionCleanupJob = new CronJob({
		cronTime: '0 0 */1 * * *',
		onTick: function() {
			logger.info('Performing session clean up...');
	  		sessionStore.all(function(err, sessions) {
        		for (var sessionId in sessions) {
       				console.log('Checking session %s', sessionId);
       				// try to access the session, will removed if it has expired
       				sessionStore.get(sessionId, function() {} );
        		}
				logger.info('Session clean up completed.');
    		});
		},
		start: false,
		timeZone: ''
	});
	sessionCleanupJob.start();

};