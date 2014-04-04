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
	getFieldInputClass : function(input) {
		if(input.$dirty && input.$invalid) {
			return "error";
		} else if (input.$dirty && !input.$invalid) {
			return "success";
		} else {
			return "";
		}
	}
  };

  return helperFunctions;
});