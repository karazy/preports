'use strict';

PReports.NavigationCtrl =  function ($scope, $route, language) {

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

	readUserLanguage();
}

PReports.NavigationCtrl.$inject = ['$scope', '$route', 'language'];