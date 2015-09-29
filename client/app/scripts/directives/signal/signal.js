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
			title: '@',
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
		        	var dialog = iElement.find('.signal-body');

		        	scope.signalValue = scope.signalEntity[scope.signalField];
	
		        	scope.switchSignal = function (state) {	

		        		if(scope.signalEnabled == true || typeof scope.signalEnabled == 'undefined') {

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

			        		scope.onSignalChange();

							console.log("Set state to " +scope.signalField);
						}

		        	}

		        	scope.isActive = function(state) {

		        		if(scope.signalEntity[scope.signalField] == state) {
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