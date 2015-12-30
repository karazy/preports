'use strict';
/** 
 * 	@constructor
 * 	Factory function for the 'helper' service.
 * 	Provides a number of useful helper methods.
 * 	Returns the service.
 * 
 * 	@author Frederik Reifschneider
 */
angular.module('PReports.services').factory('helper', function() {

	var helperFunctions = {

		/*
		 * Get css class for field highlighting.
		 * @param {NgModelController} input ng-model controller for the input to check.
		 * @returns error if dirty && invalid
		 *		  success if dirty && !invalid
		 *         empty string otherwise
		 */
		getFieldInputClass: function(input) {
			if (input.$dirty && input.$invalid) {
				return "error";
			} else if (input.$dirty && !input.$invalid) {
				return "success";
			} else {
				return "";
			}
		},
		/**
		 * Checks if given variable is a function.
		 * http://stackoverflow.com/questions/5999998/how-can-i-check-if-a-javascript-variable-is-function-type
		 * @param {Object} functionToCheck
		 */
		isFunction: function(functionToCheck) {
			var getType = {};
			return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		},

		/**
		 * Checks if String is an url.
		 * @return
		 *	True if string is a valid url. False otherwise.
		 */
		isUrl: function(url) {
			var regexp = /(^http|^https):\/\//;
			if (!url) {
				return false;
			}

			return regexp.test(url);
		},

		isZero: function(value) {
			if (value === 0) {
				return true;
			}

			return false;
		},

		isValidDate: function(d) {
			if (Object.prototype.toString.call(d) !== "[object Date]")
				return false;
			return !isNaN(d.getTime());
		},

		getMaxWeeksPerYear: function(year) {
			var baseDate;

			if(this.isValidDate(year)) {
				baseDate = new Date(year.getFullYear(), 11, 28);
				return baseDate.getWeek();
			} else if(typeof year === 'number') {
				baseDate = new Date(year, 11, 28);
				return baseDate.getWeek();
			} else if(typeof year === 'string') {
				try {
					baseDate = new Date(parseInt(year), 11, 28);	
				} catch (e) {
					return 52;
				}				
				return baseDate.getWeek();
			} else {
				//per default return 52 weeks, which fits most years
				return 52;
			}
		}
	};

	return helperFunctions;
});