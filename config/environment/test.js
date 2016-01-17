'use strict';

// Development specific configuration
// ==================================

function getConfigRootPath() {
	if (process.env.SHELL_CONFIG_BASE ) {
		return process.env.SHELL_CONFIG_BASE;
	} else {
		return (process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.preports';
	}
}

var config = {
    //If true, will disable file upload and notifications
    'demo': false,
    //Mongo DB settings
	'mongo': {
        //connection string
        'uri' : '127.0.0.1:27017'
    },
    'ip':    '0.0.0.0',
    // Server port
  	'port':     3000,
  	'protocol': 'http',
    //Authentication settings. Depending on chosen strategy.
	'authentication': {
        //set disabled true to deactivate
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