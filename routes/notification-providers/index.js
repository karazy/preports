var slack = require('./slack');


exports.getProviders = function() {

	var providers = [slack];	

	return providers;
}