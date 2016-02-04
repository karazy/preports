'use strict';

var providerManager = require('./notification-providers'),
	config = require('../config/environment'),
	report = require('./reports'),
	logger = require('../components/logger');


/**
* Send notifications for given report id to all registered providers.
*
*/
exports.sendNotifications = function(req, res) {

	var _id = req.params.id;

	if(!_id) {
		logger.info('sendNotifications: no id given');
		res.status(500).send("Missing report id.");
		return;
	}

	//no sending of notifications
	if(config.demo === true) {
		logger.info('sendNotifications: disabled in demo mode');
		res.status(403).send("error.demo");
		res.end();
		return;
	}

	if(!config || !config.notificationProviders) {
		logger.info('notifications.sendNotifications: no providers setup');
		return;
	}

	logger.info('sendNotifications: for report with id ' + _id);	
	
	report.findReport(_id, doSend);

	function doSend(status, data) {
		var providers,
			providerCallFinished = 0,
			errors = [],
			reportUrl;

		if(status != 200) {
			res.status(status).send(data);
			res.end();
			return;
		}

		if(!data.settings || !data.settings.notification) {
			logger.info('notifications.sendNotifications: no notification settings for report exist');
			res.sendStatus(200);
			res.end();
			return;
		}

		providers = providerManager.getProviders();
		reportUrl = createReportUrl(req, data);

		//send via registered providers
		providers.forEach(function(p) {			
			logger.info('Calling provider ' + p.getProviderType());
			p.send(data, evaluateStatus, reportUrl);
		});

		function evaluateStatus(success, message) {
			providerCallFinished++;
			if(!success) {
				if(Array.isArray(message)) {
					errors = errors.concat(message);
				} else {
					errors.push(message);	
				}				
			}

			//all calls finished send response
			if(providerCallFinished == providers.length) {
				logger.info('notifications.sendNotifications: all providers returned');
				if(errors.length == 0) {
					res.sendStatus(200);					
					res.end();
				} else {
					res.status(500).send(errors);
					res.end();
				}
			}
		}
	}

	function createReportUrl(request, report) {
		var url;

		url ='http://' + request.headers.host + '#/reports/' + report._id;

		return url;
	}

}

/**
* Get the providers configured for this instance.
* @return Array [{'provider': PROVIDER_NAME, 'display': DISPLAY_NAME}]
*/
exports.getConfiguredProviders = function(req, res) {
	var providers,
		providersStripped = [];

	if(!config || !config.notificationProviders) {
		logger.info('notifications.sendNotifications: no providers setup');
		res.sendStatus(200);
		res.end();
		return;
	}

	providers = config.notificationProviders;

	for(let p in providers) {
		providersStripped.push({
			'provider' : p,
			'display': providers[p].display
		});
	};

	res.status(200).send(providersStripped);
	res.end();
}
