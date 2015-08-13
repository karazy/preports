/**
* Services that interacts with Bisnode NotificationService.
* Currently in a beta state. Authentification is not supported ath the moment.
*
*/
angular.module('PReports.services').factory('com-bisnode-notification',
	['$http', 'errorHandler', 'language', '$interpolate', 'helper', '$log',  function($http, errorHandler, language, $interpolate, helper, $log) {
	var _service = {},
		//the json object consumed by bisnode notification service.
		notificationRequest = {
			"notifications":[
				{
			       "rawNotification":{
			        "notificationDeliveryMode": "EMAIL",
			          "recipients":[
			             // {
			             	//contains all remail recipients
			                // "emailRecipient":{
			                //    "email":"frederik.reifschneider@bisnode.com"
			                // }
			             // }
			          ],
			          "content": "",
			          "subject": ""
			       }
			    }
			]},
	    contentLangKey = "notification.content.template",
	    subjectLangKey = "notification.subject.template",
	    config;

	/**
	* Send notification.
	*
	*/
	_service.send = function(subject, content, recipients, callback) {

		if(!_service.config) {
			$log.log('PReports.services.com-bisnode-notification.send: config missing')
			return;
		}

		if(!_service.config.url) {
			$log.log('PReports.services.com-bisnode-notification.send: config has no url')
			return;
		}

		var notification = notificationRequest.notifications[0].rawNotification;

		notification.subject = subject;
		notification.content = content;
		notification.recipients = [];

		angular.forEach(recipients, function(r) {
			notification.recipients.push({
				'emailRecipient': r
			});
		});
		
		$http.post(_service.config.url, notificationRequest)
			.success(function(response) {
				if(helper.isFunction(callback)) {
					callback(true);
				}
			})
			.error(function(response) {
				if(helper.isFunction(callback)) {
					callback(false, response);
				}
			});
	}

	_service.isLive = true;

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
    

    return _service;

}]);