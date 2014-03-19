'use strict';

PReports.NavigationCtrl =  function ($scope, $route, language, config, $location, $http, $log, $rootScope) {

	var languageKey = "com.bisnode.preports.user.language";

	$scope.user = {};

	function readUserLanguage() {
		var lang;

		if(window.localStorage) {
			lang = window.localStorage.getItem(languageKey);
			if(!lang) {
				//read lang from language service if none is set
				lang = language.get();
			}

			$scope.user.language = lang;
		}
		
	}

	$scope.setUserLanguage = function() {
		if($scope.user.language) {
			if(window.localStorage) {
				window.localStorage.setItem(languageKey, $scope.user.language);
				language.set($scope.user.language);
				$route.reload();
			}
		}
	}

	/**
	* Get the total report count.
	*
	*/
	function getReportsCount() {
 		$http.get(config.getCombinedServiceUrl() + '/reports/count').success(function(data, status, headers, config) {
 			$rootScope.reportsCount = data;
 		}).error(function() {
 			//fail silently since this is currently not an important function
 			$log.log('getReportsCount: failed to get reports count');
 		});
 	}

	readUserLanguage();

	if($location.path() == '/about') {
		getReportsCount();
	}

	var ws = new WebSocket('ws://127.0.0.1:' + config.servicePort);
	ws.onmessage = function (event) {
    	//console.log('New WS message: ' + event.data);
    };
}

PReports.NavigationCtrl.$inject = ['$scope', '$route', 'language', 'config', '$location', '$http', '$log', '$rootScope'];

