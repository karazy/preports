'use strict';
/**
* Inspired by Google Inbox and http://bootsnipp.com/snippets/featured/inbox-by-gmail 
* Used to create new reports. 
*/
angular.module('PReports.directives').directive('composeButton', ['$locale', 'language', '$interpolate', '$timeout', function($locale, langService,$interpolate, $timeout) {

var //directive configuration
		config = {
		restrict: 'AE',
		replace: false,
		transclude: true,
		priority: 100,
		scope: {
			'cbTitle': '@',
			'onClick': '&',
            'datasource': '='
		},
		templateUrl: 'views/templates/composeButton.html',
		compile: function(element, attrs, transclude) {

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
                    var mask = iElement.find('div.compose-button-mask'),
                        composeButton = iElement.find('div.compose-button'),
                        dialog = iElement.find('div.compose-button-dialog'),
                        input = iElement.find('div.compose-button-dialog input');
                    
                    scope.language = langService;
                    
                    jQuery('.compose-button .fab').hover(function () {
                        jQuery(this).toggleClass('active');
                    });

                    jQuery(function () {
                        jQuery('.compose-button > [data-toggle="tooltip"]').tooltip()
                    });
                    
                    composeButton.bind('click', function() {
                        scope.newReportName = '';
                        showDialog();
                    });

                    mask.bind('click', function() {
                        hideDialog();
                    });
                    
                    
                    scope.save = function() {
                        scope.onClick()(scope.newReportName);
                    }
                    
                    
                    function showDialog() {
                        var maskHeight,
                            maskWidth;
                            
                        maskHeight = jQuery(document).height();
                        maskWidth = jQuery(window).width();
                        //Set height and width to mask to fill up the whole screen
                        mask.css({'width':maskWidth,'height':maskHeight}); 
                        mask.show();
                        dialog.show();
                        //delay to get focus 
                        input.focus(150);
                        
                        dialog.bind('keyup', hideDialogByEsc);
                    }
                    
                    function hideDialog() {
                        mask.hide();
                        dialog.hide();  
                        dialog.unbind('keyup',hideDialogByEsc);                      
                    }
                    
                    function hideDialogByEsc(event) {
                        //hide dialog on escape
                        if(event.which == 27) {
                            hideDialog();	
                        }						
                    }
                    
                    
		        }
		      }
		}
	};

	return config;
}]);

