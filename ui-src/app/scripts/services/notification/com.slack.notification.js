/**
* Services that interacts with a Slack.com Webhook Integration.
*/
angular.module('PReports.services').factory('com-slack-notification',
	['$http', 'errorHandler', 'language', '$interpolate', 'helper', '$log',  function($http, errorHandler, language, $interpolate, helper, $log) {
	var _service = {
			config: {
				//TODO move
				url: 'https://hooks.slack.com/services/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'
			}
		},
		//the json object consumed by slack.
		payload = {
			    "text" : "",
			    "icon_url": "https://www.bisnode.de/wp-content/themes/bisnode/images/logo.png",
			    "channel": "",
			    "username":"PReports"
			},
	    config;

	//https://hooks.slack.com/services/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

	/**
	* Send notification.
	*
	*/
	_service.send = function(subject, content, recipients, callback) {

		var errors = [],
			notification,
			status = {
				usersToNotify: 0,
				send: 0
			};

		if(!_service.config) {
			$log.log('PReports.services.com-slack-notification.send: config missing')
			return;
		}

		if(!_service.config.url) {
			$log.log('PReports.services.com-slack-notification.send: config has no url')
			return;
		}

		notification = payload;

		//TODO parse and encapsulate urls for Slack messages
		notification.text = content;		


		//create one notification for each recipient and send it
		angular.forEach(recipients, function(r) {
			if(r.type == _service.type && r.email) {
				status.usersToNotify++;

				var slackNotification = angular.copy(notification);
				slackNotification.channel = '@' + r;

				$http.post(_service.config.url, notification)
				.success(function(response) {
					status.send++;
					//if(helper.isFunction(callback)) {
					//	callback(true);
					//}
					if(status.send == status.usersToNotify) {
						if(errors.length > 0) {
							displayErrors(errors);
						}	
					}
				})
				.error(function(response) {
					$log.error("Failed so send slack notification for user " + r + ". Status: " + response.status);
					errors.push(response);
					status.send++;
					if(status.send == status.usersToNotify) {
						displayErrors(errors);
					}					
				});
			}


		});

		callback(true);
	}

	_service.isLive = true;
	_service.type = 'slack';

	/**
	* Check if service is online.
	*/
	function checkIsLive(url) {
		$http.get(url)
			.success(function(response) {
				if(response.status !== 0) {
					_service.isLive = true;	
				}				
			})
			.error(function(response) {
				_service.isLive = false;
			});
	}

	function displayErrors(errors) {
		if(!errors || !errors.length) {
			return;
		}

		$log.log("Amount of errors " + errors.length);
		//deal with 500 Invalid channel specified
	}
    

    return _service;

}]);