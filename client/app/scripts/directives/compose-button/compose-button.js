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
                    var mask = iElement.find('div.compose-button-mask'),
                        composeButton = iElement.find('div.compose-button'),
                        dialog = iElement.find('div.compose-button-dialog'),
                        input = iElement.find('#report_new_title_field_compose');
                    
                    scope.language = langService;
                    
                    jQuery('.compose-button .fab').hover(function () {
                        jQuery(this).toggleClass('active');
                    });
                    jQuery(function () {
                        jQuery('.compose-button > [data-toggle="tooltip"]').tooltip()
                    });
                    
                    composeButton.bind('click', function() {
                        showDialog();
                    });
                    
                    scope.save = function() {
                        scope.onClick();
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
                        input.focus();
                    }
                    
                    function hideDialog() {
                        mask.hide();
                        dialog.hide();
                    }
                    
                    
		        }
		      }
		}
	};

	return config;
}]);

