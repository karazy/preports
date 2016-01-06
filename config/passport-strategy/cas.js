'use strict';
/**
* Cas Strategy configuration.
*
*/

var casStrategy = require('passport-cas').Strategy;

module.exports = {

	'configureStrategy': function(config) {
		return new casStrategy({
	        'version': config.version,
	        'validateURL': config.validateURL,
	        'ssoBaseURL': config.ssoBaseURL,
	        'serverBaseURL': config.serverBaseURL
	    }, function(profile, done) {
	        var login = profile.subscriberId;
	        return done(null, profile);
	    })
	}
} 
