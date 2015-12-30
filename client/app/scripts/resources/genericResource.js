'use strict';
angular.module('PReports.resources').factory('genericResource',['$resource','config', 'errorHandler', function($resource, config, handleError) {

	function ResourceFactory(url, paramDefaults, actions) {
		var _resource = $resource(config.getCombinedServiceUrl() + url, paramDefaults, actions);

		_resource.prototype.saving = false;

		_resource.prototype.isSaving = function() {
			return _resource.prototype.saving;
		}

		_resource.prototype.setSaving = function(saving) {
			_resource.prototype.saving = saving;
		}
		/**
		* @name PR.services.genericResource#$create
		* Same as calling $save. But sets a saving flag while ajax request is running.
		*
		*/
	    _resource.prototype.$create = function(a1, a2, a3) {
	    	 var me = this,
	    	 	 params,
              	 success = angular.noop,
              	 error;

	          switch(arguments.length) {
		          case 3: params = a1; success = a2; error = a3; break;
		          case 2:
		          case 1:
		            if (angular.isFunction(a1)) {
		              success = a1;
		              error = a2 || handleError;
		            } else {
		              params = a1;
		              success = a2 || angular.noop;
		              error = handleError;
		            }
		          case 0: break;
		          default:
		            throw "Expected between 1-3 arguments [params, success, error], got " +
		              arguments.length + " arguments.";
	          }


	    	 	
	    	me.setSaving(true);
	       	me.$save(params, function(record, responseHeaders) {
	       		me.setSaving(false);
	       		success(record, responseHeaders);
	       	}, function(_response, _status, _headers, _config) {
	       		me.setSaving(false);	       		
	       		error(_response, _status, _headers, _config);
	       	});
	    };

		return _resource;
	}

	return ResourceFactory;
}]);