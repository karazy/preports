'use strict';

angular.module('PReports').controller('NavigationCtrl',  ['$scope', '$route', 'language', 'config', '$location', '$http', '$log', '$rootScope', function ($scope, $route, language, config, $location, $http, $log, $rootScope) {

	var languageKey = "preports.user.language";

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

 	/**
 	* Checks if the page is embeded in an iFrame.
 	*
 	* @return true if in iFrame
 	*/
 	$scope.inIFrame = function() {
 		var inIFrame = true;
	    try {
	        inIFrame = window.self !== window.top;
	    } catch (e) {
	        return true;
	    }

	    //console.log("App embeded in iFrame " + inIFrame);

	    return inIFrame;
 	}

	readUserLanguage();

	if($location.path() == '/about') {
		getReportsCount();
	}
}]);
