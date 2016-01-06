'use strict';

// Heroku specific configuration
// ==================================

var casStrategy = require('passport-cas').Strategy;
function getConfigRootPath() {
	if (process.env.SHELL_CONFIG_BASE ) {
		return process.env.SHELL_CONFIG_BASE;
	} else {
		return (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.preports';
	}
}

var config = {
    'demo': true,
	'ip':    '0.0.0.0',
    // Server port
  	'port':     3000,    
  	'protocol': 'http',
	'authentication': {
	    'disabled': true
	},
	'session': {
        'secret': 'xf435g5ghr54gd54gdf54gd45',
        'cookie': {
            maxAge: 60000 * 30
        }
    },
    'application': {
      'baseDirectory' : getConfigRootPath() + '/application'
    },
    'logging': {
      'logFile': getConfigRootPath() + '/preports.log'
    },
    'notificationProviders': {
    	'slack' : {
    		'host' : 'hooks.slack.com',
    		'path' : '/services/T09JE4DST/B0AKK58JW/ellqoXgP3wiQRk4RdXIXWQ8n'
    	},
    	'bisnode' : {
    		'host': 'ysr-dev-service-01',
    		'path': '/rest/notification-service',
        'port': 8181
    	}
    }
};


module.exports = config;