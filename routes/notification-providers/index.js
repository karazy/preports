var slack = require('./slack'),
	bisnode = require('./bisnode'),
	email = require('./mail');



exports.getProviders = function() {

	var providers = [slack, email, bisnode];	

	return providers;
}