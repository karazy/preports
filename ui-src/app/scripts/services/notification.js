/**
* Service allows to send notifications (emails).
*/
angular.module('PReports.services')
	.factory('notification',['$http', 'errorHandler', 'language', '$injector', 'config', '$log',  function($http, errorHandler, language, $injector, config, $log) {

	var service = {}, //the service itself
		services = [], //notification providers
		notificationConfig;


	setupNotificationConfig();
	setupProviders();

	/**
	* Send notifications to all registered providers.
	*/
	service.send = function(subject, content, recipients, callback) {
		if(!services || services.length == 0) {
			alert('No notification provider configured.');
			$log.log('PReports.services.notification.send: no valid notificationProvider to delegate send to');	
			return;
		}


		//Hand over all arguments to each service and let him handle only the ones he is interested in
		angular.forEach(services, function(service) {
			service.send(subject, content, recipients, callback);
		});		
	}

	function setupProviders() {
		if(!config.notificationProviders) {
			$log.log('PReports.services.notification: no notificationProviders configured. Cancel initialization.');
			return service;
		}

		var providers;

		if(!angular.isArray(config.notificationProviders)) {
			providers = [config.notificationProviders];
		} else {
			providers = config.notificationProviders;
		}

		angular.forEach(config.notificationProviders, function(provider) {
			var service;
			
			$log.log("Setup notification provider " + provider);
			
			try {
				service = $injector.get(provider);
				//TODO provider specific config
				if(provider == 'com-bisnode-notification') {
					service.config = notificationConfig;					
				}
				
			} catch(e) {
				$log.error('PReports.services.notification: '+ provider +' is not a valid notificationProvider.\n' + e);
				return service;
			}
			service.initialized = true;	
			services.push(service);
		});

	}



	function setupNotificationConfig() {
		notificationConfig = {};

		notificationConfig.url = config.notificationUrl;
	}

	return service;

}]);