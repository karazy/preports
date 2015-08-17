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
			signalEntity: '='
		},
		template: function(element, attrs) {
			var html,
				btnClass = attrs.hasOwnProperty('dialogConfirmBtnCls') ? attrs.dialogConfirmBtnCls : "btn-primary";

			html = 

				'<div class="signal">'+
					'<div class="signal-title" l="{{title}}"></div>'+
					'<div class="signal-body">'+
						'<div class="signal-light" ng-class="{red: isActive(1)}" ng-click="switchSignal(\'red\')">'+
							'<input type="radio" value="1" name="budget" ng-model="signalValue" ng-change=""/>'+
						'</div>'+
						'<div class="signal-light" ng-class="{yellow: isActive(2)}" ng-click="switchSignal(\'yellow\')">'+
							'<input type="radio" value="2" name="budget" ng-model="signalValue" ng-change=""/>'+
						'</div>'+
						'<div class="signal-light" ng-class="{green: isActive(3)}" ng-click="switchSignal(\'green\')">'+
							'<input type="radio" value="3" name="budget" ng-model="signalValue" ng-change=""/>'+
						'</div>'+
					'</div>'+
				'</div>'
			;

			return html;
		},
		compile: function(element, attrs, transclude) {

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('.signal-body');

		        	scope.signalValue = scope.signalEntity[scope.signalField];
	
		        	scope.switchSignal = function (state) {		 

		        		//scope.activeState = state;       		

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