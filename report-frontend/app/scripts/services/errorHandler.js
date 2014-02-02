angular.module('PReports.services').factory('errorHandler',['$rootScope','$location','$log','language','config', function($rootScope,$location,$log,langService,config) {
	/**
	*	Service to handle callback for errors during Resource methods.(get,save,query, etc.).
	*	
	*	@param {Object} response Object containing response and request data of the failed HTTP request.
	*/
	function handleError(_response, _status, _headers, _config) {
		var response;
		if(arguments.length > 1) {
			response = {};
			response.data = _response;
			response.status = _status;
			response.headers = _headers;
			response.config = _config;
		}
		else {
			if(_response.hasOwnProperty('data')) {
				response = _response;	
			}
			else {
				response = {
					'data': _response
				}
			}
			
		}

		var errorKey = response.data['errorKey'],
			responseMessage = response.data['message'];

		$rootScope.error = true;
		// Set the error message to the first valid message out of the following:
		// - translation from the specified error key
		// - translation from the http status code
		// - untranslated message from the response
		// - translated generic error text
		// - placeholder text

		$rootScope.errorMessage = langService.translate(errorKey) || langService.translate('error.'+ response.status)
			|| responseMessage || langService.translate('error.general') || "Error during communication with service.";

		// Log the response.
		$log.error("Error during http method, response object: " + angular.toJson(response));
	}
	
	handleError.reset = function() {
		$rootScope.error = false;
	};

	return handleError;
}]);