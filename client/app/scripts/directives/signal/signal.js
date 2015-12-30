'use strict';
/**

*/
angular.module('PReports.directives').directive('signal', ['$locale', 'language', '$interpolate', function($locale, langService,$interpolate) {

var //directive configuration
		config = {
		restrict: 'AE',
		replace: false,
		transclude: true,
		priority: 100,
		scope: {
			signalTitle: '@',
			onSignalChange: '&',
			signalField: '@',
			signalEntity: '=',
			signalEnabled: '=',
		},
		templateUrl: 'views/templates/signal.html',
		compile: function(element, attrs, transclude) {

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('.signal-body'),
		        		prevValue;

		        	//scope.signalValue = scope.signalEntity[scope.signalField];
	
		        	scope.switchSignal = function (state) {	

		        		if(scope.signalEnabled == true || typeof scope.signalEnabled == 'undefined') {

		        			prevValue = scope.signalEntity[scope.signalField];

			        		switch(state) {
			        			case 'red':
			        				scope.signalEntity[scope.signalField] = 1;
			        				break;
			        			case 'yellow':
			        				scope.signalEntity[scope.signalField] = 2;
			        				break;
			        			case 'green':
			        				scope.signalEntity[scope.signalField] = 3;
			        				break;
			        		}

			        		scope.onSignalChange({
			        			'modifiedProperty': scope.signalField, 
			        			'prevValue': prevValue
			        		});

							console.log("Set state to " +scope.signalField);
						}

		        	}

		        	scope.isActive = function(state) {

		        		if(scope.signalEntity && scope.signalEntity[scope.signalField] == state) {
		        			return true;
		        		} else {
		        			return false;
		        		}
		        	}



		        	
		        	iElement.find('.toggler').bind('click', function() { 
		        		var modal;
		        		if(!scope.dialogDisabled) {
		        			modal = iElement.find(".confirm-modal");
		        			modal.modal('toggle');	
		        		}		        		
		        		
					});        	

		        }
		      }
		}
	};

	function l(key) {
		return langService.translate(key) || key;
	}

	return config;
}]);