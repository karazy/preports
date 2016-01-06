'use strict';

var passport = require('passport');
var config = require('./environment');	


module.exports.initialize = function(app) {
	console.log('Initialize passport');
	
	//check if auth is disabled
	if(!config.authentication) {
		//throw error!
	}

	strategy = require('./passport-strategy/' + config.authentication.strategy).configureStrategy(config.authentication);

	passport.use(strategy);

	var users = {};

	passport.serializeUser(function(user, done) {
		users[user.id] = user;
		done(null, user);
	});

	passport.deserializeUser(function(user, done) {
		done(null, users[user.id]);
	});

	app.use(passport.initialize());
	app.use(passport.session());
};
