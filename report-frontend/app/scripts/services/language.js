/** 
* 	@constructor
* 	Factory function for the 'language' service.
* 	Returns the service.
* 
* 	@author Frederik Reifschneider
*/
angular.module('PReports.services').factory('language', ['$log', 'translation', function($log, translation) {
	/**
	* @private
	* Retrieve browser language.
	*
	*/
	function getBrowserLang() {
		var userLang = (navigator.language) ? navigator.language : navigator.userLanguage; 
		$log.info('browser language: '+userLang);
		if(userLang === 'undefined'|| userLang.length == 0) {
			//use default language
			userLang = "DE";
		}
		return userLang.substring(0,2).toUpperCase();
	}

	var browserLang = getBrowserLang();

	/**
	*	@name PReports.services.language
	*
	*	Exposes methods for translation and language handling.
	*
	*	@author Frederik Reifschneider
	*/
	var langService = {
		/**
		* @name Cloobster.services.lang#get
		* 
		* Return Browser language.
		*/
		get: function() {
					return getBrowserLang();
		},
		/**
		* @name Cloobster.services.lang#translate
		* 
		* Get translation for given key.
		* @param key
		*		Key for string to translate
		*	@return
		*		Translated string.
		*/
		translate: function(key) {
				
				if(!key || !translation[key]) {
					return "";
				}

				return translation[key][browserLang] || "";
		}
	}

	return langService;
}]);