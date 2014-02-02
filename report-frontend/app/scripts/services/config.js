/** 
*	@constructor
* 	Provider for the 'config' service.
* 	Returns configuration object used in all services.
* 
* 	@author Nils Weiher
*/
angular.module('PReports.services').provider('config', function() {
	var self = this;
	/**
		Default config can be overridden with setConfig.
		@private
	*/
	self.config_ = {
		'serviceUrl' : '',
		'priceRegExp' : /([0123456789]+)\.([0123456789]*)/,
		'currencyFormats' : {
			'EUR': '$1,$2 €',
			'USD': '\$ $1.$2'
		}
	}

	/**
		Override the configuration paramters with the supplied map.

		@param {Object.<string, string>} config Paramter object for configuration.
			Only 'serviceUrl' is used at the moment.
	*/
	self.setConfig = function (config) {
		self.config_['serviceUrl'] = config['serviceUrl'];
		self.config_['priceRegExp'] = config['priceRegExp'];
		self.config_['currencyFormats'] = config['currencyFormats'];
	};

	self.setServiceUrl = function(serviceUrl) {
		self.config_['serviceUrl'] = serviceUrl;
	};

	self.setPriceRegExp = function(value) {
		self.config_['priceRegExp'] = value;
	};

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

	self.$get = function() {
		return self.config_;
	};
});