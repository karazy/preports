'use strict';
/**
*  Inspired by Google Inbox and http://bootsnipp.com/snippets/featured/inbox-by-gmail 
*/
angular.module('PReports.directives').directive('composeButton', ['$locale', 'language', '$interpolate', function($locale, langService,$interpolate) {

var //directive configuration
		config = {
		restrict: 'AE',
		replace: false,
		transclude: true,
		priority: 100,
		scope: {
			'title': '@',
			'onClick': '&',
		},
		templateUrl: 'views/templates/composeButton.html',
		compile: function(element, attrs, transclude) {

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
                    
                    
                    jQuery('.compose-button .fab').hover(function () {
                        jQuery(this).toggleClass('active');
                    });
                    jQuery(function () {
                        jQuery('.compose-button > [data-toggle="tooltip"]').tooltip()
                    });
// 		        	var dialog = iElement.find('.signal-body'),
// 		        		prevValue;
// 
// 		        	//scope.signalValue = scope.signalEntity[scope.signalField];
// 	
// 		        	scope.switchSignal = function (state) {	
// 
// 		        		if(scope.signalEnabled == true || typeof scope.signalEnabled == 'undefined') {
// 
// 		        			prevValue = scope.signalEntity[scope.signalField];
// 
// 			        		switch(state) {
// 			        			case 'red':
// 			        				scope.signalEntity[scope.signalField] = 1;
// 			        				break;
// 			        			case 'yellow':
// 			        				scope.signalEntity[scope.signalField] = 2;
// 			        				break;
// 			        			case 'green':
// 			        				scope.signalEntity[scope.signalField] = 3;
// 			        				break;
// 			        		}
// 
// 			        		scope.onSignalChange({
// 			        			'modifiedProperty': scope.signalField, 
// 			        			'prevValue': prevValue
// 			        		});
// 
// 						}
// 
// 		        	}
// 
// 		        	scope.isActive = function(state) {
// 
// 		        		if(scope.signalEntity && scope.signalEntity[scope.signalField] == state) {
// 		        			return true;
// 		        		} else {
// 		        			return false;
// 		        		}
// 		        	}

		        }
		      }
		}
	};

	function l(key) {
		return langService.translate(key) || key;
	}

	return config;
}]);

