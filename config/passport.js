'use strict';

var passport = require('passport'),
	config = require('./environment'),
	logger = require('../components/logger');

/**
* Configures Passport depending on configured strategy.
*/
module.exports.initialize = function(app) {
	var strategy;

	logger.info('Initialize passport');
	
	//check if auth is disabled
	if(!config.authentication || config.authentication.disabled) {
		//No authentication configured. Skip passport.
		logger.info('Authentication disabled');
		return;
	}

	strategy = require('./passport-strategy/' + config.authentication.strategy).configureStrategy(config.authentication);

	passport.use(strategy);

	var users = {};

	passport.serializeUser(function(user, done) {
		//Is this correct?
		done(null, user);
	});

	passport.deserializeUser(function(id, done) {
		//Is this correct?
		done(null, id);	
	});

	app.use(passport.initialize());
	app.use(passport.session());
};
