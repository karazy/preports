var config = require('../../config/environment'),
	clone = require('clone'),
	https = require('https'),
	strTpl = require("string-template"),
	logger = require('../../components/logger');

var //the json object consumed by slack.
	payload = {
		    "text" : "",
		    "channel": "",
		    "username":"PReports"
		},
	isLive = true,
	PROVIDER_TYPE = 'slack',
	TEMPLATE = 'Project report for {name} - CW {week}|{year} is available under <{reportUrl}>';

	/**
	* Send notification.
	*
	*/
	exports.send = function(report, callback, reportUrl) {
		//subject, content, recipients, callback

		var errors = [],
			notification,
			//keep track of number of users this is send to as well as the successful calls
			status = {
				usersToNotify: 0,
				send: 0
			},
			slackWebhookUrl,
			recipients,
			handle = false;

		report.reportUrl = reportUrl;

		if(!config.notificationProviders.slack) {
			logger.info('slack.send: config has no url');
			callback(true);
			return;
		}

		if(!report) {
			logger.info('slack.send: Missing report.');
			callback(true);
			return;
		}

		if(!config.notificationProviders.slack.host) {
			logger.info('slack.send: config has no url');
			callback(true);
			return;
		}

		//Url for slack webhook
		slackWebhookHost = config.notificationProviders.slack.host;
		slackWebhookPath = config.notificationProviders.slack.path;

		recipients = report.settings.notification.recipients;

		if(!recipients || !recipients.length) {
			logger.info('slack.send: report has no recipients');
			callback(true);
			return;
		}

		notification = payload;
		notification.text = strTpl(TEMPLATE, report);

		//count slack recipients
		recipients.forEach(function(r) {
			if(r.type == PROVIDER_TYPE && r.email) {
				status.usersToNotify++;
			}
		});

		//create one notification for each recipient and send it
		recipients.forEach(function(r) {
			if(r.type == PROVIDER_TYPE && r.email) {
				handle = true;

				var slackNotification = clone(notification);

				slackNotification.channel = '@' + r.email;

				//make the call
				var options = {
				  'host': slackWebhookHost,
				  'path': slackWebhookPath,
				  'method': 'POST',
				  'headers': {
				    'Content-Type': 'application/json'
				  }
				};

				var req = https.request(options, function(res) {					
				    status.send++;
					if(status.send == status.usersToNotify) {
						logger.info('slack.send: finished sending');
						if(errors.length > 0) {
							formatErrors(errors);
							callback(false, errors);
						} else {
							callback(true);	
						}						
					}
				});

				req.on('error', function(e) {
				  	logger.info('problem with request: ' + e.message);
					errors.push(e.message);
					status.send++;
					if(status.send == status.usersToNotify) {
						formatErrors(errors);
						callback(false, errors);
					}
				});

				// write data to request body
				req.write(JSON.stringify(slackNotification));
				req.end();
			}
		});

		if(!handle) {
			logger.info('slack.send: No handlers found.');
			callback(true);
		}
	}

	exports.getProviderType = function() {
		return PROVIDER_TYPE;
	}

	/**
	* Check if service is online.
	*/
	function checkIsLive(url) {
		$http.get(url)
			.success(function(response) {
				if(response.status !== 0) {
					isLive = true;	
				}				
			})
			.error(function(response) {
				isLive = false;
			});
	}

	/**
	* Format the errors to return to caller.
	*
	*/
	function formatErrors(errors) {
		if(!errors || !errors.length) {
			return;
		}

		//$log.log("Amount of errors " + errors.length);
		//deal with 500 Invalid channel specified
	}
    
