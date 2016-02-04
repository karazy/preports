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
        'level' : 'info',
        'logFile': getConfigRootPath() + '/preports.log'
    },
    'notificationProviders': {
        //no notifications in demo mode
        'slack' : {
            'display': 'Slack',
            'host' : 'hooks.slack.com',
            'path' : '/services/webhook/from/slack'
        },
        'mail' : {
            'display': 'e-mail',
            'host': 'smtp.strato.de',
            'port': 465,
            'secure': true, // use SSL
            'auth': {
                'user': 'notification@p-reports.com',
                'pass': 'secret'
            }
        }
    }
};


module.exports = config;