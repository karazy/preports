'use strict';
/** 
*	@constructor
* 	Provider for the 'config' service.
* 	Returns configuration object used in all services.
* 
*/
angular.module('PReports.services').service('config', ['$http', function($http) {
        
	var self = this;
	/**
		Default config can be overridden with setConfig.
		@private
	*/
	self.config_ = {
		'serviceUrl' : 'http://127.0.0.1',
		'servicePort' : '3000',
		'version' : '1.6.2 Jolly Jaguar',
		'priceRegExp' : /([0123456789]+)\.([0123456789]*)/,
		'currencyFormats' : {
			'EUR': '$1,$2 €',
			'USD': '\$ $1.$2'
		},
		'COST_EXTERNAL' : 85,
		'COST_INTERNAL' : 68,
		'COST_NEARSHORE': 45,
		'defaultCostTypes' : []
	}

	/**
		Override the configuration paramters with the supplied map.

		@param {Object.<string, string>} config Paramter object for configuration.
			Only 'serviceUrl' is used at the moment.
	*/
	self.setConfig = function (config) {
		self.config_['serviceUrl'] = config['serviceUrl'];
		self.config_['servicePort'] = config['servicePort'];
		self.config_['priceRegExp'] = config['priceRegExp'];
		self.config_['currencyFormats'] = config['currencyFormats'];
	};

	self.setServiceUrl = function(serviceUrl) {
		self.config_['serviceUrl'] = serviceUrl;
	};

	self.setservicePort = function(servicePort) {
		self.config_['servicePort'] = servicePort;
	};

	self.setPriceRegExp = function(value) {
		self.config_['priceRegExp'] = value;
	};
    


    
    	/**
	* Returns combined url based on serviceUrl and servicePort.
	* If nothing is configured, will return location.host.
	* @return 
	*  The REST service url.
	*
	*/
	self.config_['getCombinedServiceUrl'] = function() {
		if(!self.config_['serviceUrl']) {
			//if no url was specified, use caller url
			return location.protocol + "//" + location.host;
		}

		if(!self.config_['servicePort']) {
			return self.config_['serviceUrl'];
		}

		return self.config_['serviceUrl'] + ':' + self.config_['servicePort'];
	}

	/**
	*	If called with one argument, override the currency formats with the specified map.
	*	If called with two arguments, set the format string (specified by the second argument)
	*	for currency specified by the first argument.
	*	@param {(Object.<string, string>|string)} a1 - Map or currency identifier if called with the second argument.
	*	@param {=string} a2 - format string for regex replacement for currency values.
	*/
	self.setCurrencyFormats = function(a1, a2) {
		if(arguments.length == 1) {
			self.config_['currencyFormats'] = a1;
		}

		if(arguments.length == 2) {
			self.config_['currencyFormats'][a1] = a2;
		}
	};
    
    /**
     * Loads brand logo and stores it for printing display.
     */
    function getBrandLogo() {
        $http.get(self.config_['getCombinedServiceUrl']() + '/config/logo', {'responseType': 'blob'}).then(function(response) {
            if(response.status == 200) {
                //get image data as blob
                var blob = new Blob([response.data], {type: "image/png"});
                //convert to object url ready for display
                self.config_['brandLogo'] = (window.URL || window.webkitURL).createObjectURL(blob);
                self.config_['brandLogoExists'] = true;    
            } else {
                self.config_['brandLogoExists'] = false;
            }                
        }, function() {
            self.config_['brandLogoExists'] = false;
        });
    }
	
	 /**
     * Loads default cost types.
     */
    function getDefaultCostTypes() {
        $http.get(self.config_['getCombinedServiceUrl']() + '/config/costtypes', {'responseType': 'application/json'}).then(function(response) {
            if(response.status == 200) {
                self.config_['defaultCostTypes'] = response.data;    
            }              
        }, function() {
            
        });
    }
    
    function activate() {
       getBrandLogo();
	   getDefaultCostTypes();
    }
    
    activate();
    
    return self.config_;
}]);    