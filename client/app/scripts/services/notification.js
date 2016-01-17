'use strict';

angular.module('PReports.services').service('notification', [
	'$http',
	'config',
	'errorHandler',
	'$log',
	'helper',
	function($http, config, errorHandler, $log, helper) {

	var _service = {
		/**
	     * Sends a notification (email) to recipients listed in $scope.currentReport.settings.notification.recipients.
	     * Uses PReports.service.notification.
	     */
	    // sendNotifications = function() {
	    //   var subject,
	    //     content,
	    //     templateData;

	    //   if (!$scope.currentReport) {
	    //     console.log('sendNotifications: no current report');
	    //     return;
	    //   }

	    //   $http.post(config.getCombinedServiceUrl() + '/reports/' + $scope.currentReport._id + '/notifications')
	    //     .success(angular.noop)
	    //     .error(function(response) {
	    //       $log.error('Failed so send notifications ' + response);
	    //       errorHandler(response);
	    //     });
	    // },

	    getProviders : function(cb) {
	    	$http.get(config.getCombinedServiceUrl() + '/notifications/providers')
	    	.success(function(data) {
	    		if(helper.isFunction(cb)) {
	    			cb(data);	
	    		} else {
	    			$log.error('notification: no callback function');
	    		}
	   
	    	})
	        .error(function(response) {
	          	$log.error('Failed to get notification providers ' + response);
	          	errorHandler(response);
	        });
	    }
	};


	return _service;

}]);