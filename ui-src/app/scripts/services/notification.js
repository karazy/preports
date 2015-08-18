/**
* Service allows to send notifications (emails).
*/
angular.module('PReports.services')
	.factory('notification',['$http', 'errorHandler', 'language', '$injector', 'config', '$log',  function($http, errorHandler, language, $injector, config, $log) {

	var service = {
			initialized: false
		},
		notificationConfig;

	setupNotificationConfig();

	/**
	* Will be overriden from valid notification provider.
	* Define dummy send function when no valid provider was found.
	*/
	service.send = function() {
		alert('No notification provider configured.');
		$log.log('PReports.services.notification.send: no valid notificationProvider to delegate send to');
	}

	if(!config.notificationProvider) {
		$log.log('PReports.services.notification: no notificationProvider configured. Cancel initialization.');
		return service;
	}

	try {
		service = $injector.get(config.notificationProvider);
		service.config = notificationConfig;
	} catch(e) {
		$log.error('PReports.services.notification: '+ config.notificationProvider +' is not a valid notificationProvider.\n' + e);
		return service;
	}

	service.initialized = true;	

	function setupNotificationConfig() {
		notificationConfig = {};

		notificationConfig.url = config.notificationUrl;
	}

	return service;

}]);