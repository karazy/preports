angular.module('PReports.directives').directive('simpleConfirmDialog', ['language', '$log', '$timeout', function(langService, $log, $timeout) {
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
			dialogClass: '@',
		},
		template: function(element, attrs) {
			var html,
				dClass = attrs.hasOwnProperty('dialogClass') ? attrs.dialogClass : "alert-info";

			html = 
			'<span class="toggler" ng-transclude></span>'+
			'<div class="modal confirm-modal">'+
				'<div class="modal-dialog">'+
					'<div class="modal-content">'+
				 	'<div class="modal-header">'+
					    	'<button type="button" class="close" data-dismiss="modal">×</button>'+
					    	'<h4 l="{{dialogTitle}}">Confirm dialog</h4>'+
					'</div>'+
					'<div class="modal-body '+dClass+'">'+
					    	'<p l="{{dialogText}}"></p>'+
				   '</div>  '+
					'<div class="modal-footer">'+
					  		'<button type="button" class="btn" data-dismiss="modal" l="cancel">Cancel</button>'+
					    	'<button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="confirm()" l="{{dialogConfirmButton}}">Confirm</button>'+
					'</div>'+
					'</div>'+
				'</div>'+
			'</div>';

			return html;
		},
		compile: function(element, attrs, transclude) {

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('.simple-confirm-dialog');
	
		        	scope.confirm = function () {		        		
						dialog.modal('hide');						
		        		//TODO workaround. screen stays masked when switching view       		
		        		$timeout(scope.dialogOnConfirm, 150);		        		
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