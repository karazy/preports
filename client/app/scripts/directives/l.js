/**
* Used to translate UI texts.
* Usage: l="languageKey"
* (optional) l-attribute: if specified translates an attribute instead of html content
*/
angular.module('PReports.directives').directive('l', ['$locale', 'language', '$interpolate', function($locale, langService,$interpolate) {


	//link function
	return function (scope, iElement, iAttrs, controller) {
		var key = iAttrs.l,
			//attribute whos value to translate, if nothing provided html content is replaced
			replaceAttr = iAttrs.lAttribute,
			translation,
			interpolation,
			oldWatch;

		function watchTranslation(value) {
			if(!value) {
				return;
			}

			//if no translation is found, don't replace html, this is useful to provide default values in html
			translation = langService.translate(value) || (replaceAttr ? iAttrs[replaceAttr]  :iElement.html());

			// Interpolate the text to parse possible {{expressions}}
			interpolation = $interpolate(translation);

			// Deregister a possible previous watcher.
			(oldWatch || angular.noop)();

			// Register for changes to the interpolated translation.
			// Ensure the translated value is updated if the binding changes.
			// The return value is a deregister function and will be saved for later.
			oldWatch = scope.$watch(interpolation, function(newVal, oldVal) {
				// Write the inner html text.
				// newVal is the result of evaluating the interpolated expression against the scope.
				if(!replaceAttr) {
					iElement.html(newVal);	
				} else {
					iElement.attr(replaceAttr, newVal);
				}
				
			});
		}

		iAttrs.$observe('l', watchTranslation);
		watchTranslation(key);
	}
}]);