var slack = require('./slack'),
	bisnode = require('./bisnode');


exports.getProviders = function() {

	var providers = [slack, bisnode];	

	return providers;
}