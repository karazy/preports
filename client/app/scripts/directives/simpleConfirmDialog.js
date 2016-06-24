'use strict';
angular.module('PReports.directives').directive('simpleConfirmDialog', ['language', '$log', '$timeout', '$compile', '$document', function(langService, $log, $timeout, $compile, $document) {
	var //directive configuration
		config = {
		restrict: 'A',
		replace: false,
		transclude: true,
		priority: 100,
		scope: {
			dialogTitle: '@',
			dialogText: '@',
			dialogOnConfirm: '&',
			dialogConfirmButton: '@',
			dialogDisabled: '=',
			dialogConfirmBtnCls: '@',
		},
		template: function(element, attrs) {
			var html,
				btnClass = attrs.hasOwnProperty('dialogConfirmBtnCls') ? attrs.dialogConfirmBtnCls : "btn-primary";

			html = 
			'<span class="toggler" ng-transclude></span>'			

			return html;
		},
		compile: function(element, attrs, transclude) {
			var tId = Date.now() + '_scd',
				btnClass = attrs.hasOwnProperty('dialogConfirmBtnCls') ? attrs.dialogConfirmBtnCls : "btn-primary";

			var modalTpl =
			'<div class="modal confirm-modal" id="'+tId+'" >'+
				'<div class="modal-dialog">'+
					'<div class="modal-content">'+
				 	'<div class="modal-header">'+
					    	'<button type="button" class="close" data-dismiss="modal">×</button>'+
					    	'<h4 l="{{dialogTitle}}">Confirm dialog</h4>'+
					'</div>'+
					'<div class="modal-body">'+
					    	'<p l="{{dialogText}}"></p>'+
				   '</div>  '+
					'<div class="modal-footer">'+
					  		'<button type="button" class="btn btn-default" data-dismiss="modal" l="cancel">Cancel</button>'+
					    	'<button type="button" class="btn '+btnClass+'" data-dismiss="modal" ng-click="confirm()" l="{{dialogConfirmButton}}">Confirm</button>'+
					'</div>'+
					'</div>'+
				'</div>'+
			'</div>';

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('.simple-confirm-dialog');

					var modalCompiled = $compile(modalTpl)(scope);
					$document.find('body').prepend(modalCompiled);
	
		        	scope.confirm = function () {		        		
						dialog.modal('hide');						
		        		//TODO workaround. screen stays masked when switching view       		
		        		$timeout(scope.dialogOnConfirm, 150);		        		
		        	}

		        	
		        	iElement.find('.toggler').bind('click', function() { 
		        		var modal;
		        		if(!scope.dialogDisabled) {	
							modal = angular.element($document[0].body).find("#"+tId);						
		        			//modal = iElement.find(".confirm-modal");
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