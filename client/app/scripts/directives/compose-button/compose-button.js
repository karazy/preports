'use strict';
/**
* Inspired by Google Inbox and http://bootsnipp.com/snippets/featured/inbox-by-gmail 
* Used to create new reports. 
*/
angular.module('PReports.directives').directive('composeButton', ['$locale', 'language', '$interpolate', '$timeout', 'hotkeys', function($locale, langService,$interpolate, $timeout, hotkeys) {

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
                        input = iElement.find('div.compose-button-dialog input'),
                        //holds the normal esc hotkey
                        hotkeySave;
                    
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
                        
                        maskHeight = angular.element(document).height();
                        maskWidth = angular.element(window).width();
                        //Set height and width to mask to fill up the whole screen
                        mask.css({'width':maskWidth,'height':maskHeight});
                        //delay to get focus
                        $timeout(function() {
                            input.trigger("focus");
                        }, 150);
                        
                        mask.show();
                        dialog.show();
                        
                        //replace the existing esc hotkey temporarily with one to close the new report dialog
                        hotkeySave = hotkeys.get('esc');
                        hotkeys.del('esc');                        
                        hotkeys.add(
                            {
                            combo: 'esc',
                            allowIn: ['INPUT'],
                            description: 'Close new report dialog',
                            callback: function(event) {
                                hideDialog();
                                }
                            }
                        );                                                               
                    }
                    
                    function hideDialog() {
                        mask.hide();
                        dialog.hide();  
                        hotkeys.del('esc');
                        hotkeys.add(hotkeySave);                      
                    }
                    
                    
		        }
		      }
		}
	};

	return config;
}]);

