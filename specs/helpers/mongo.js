"use strict";

var embeddedMongoDB = require('node-embedded-mongodb');

var dbPath = '.tmp/data/db/';
var logPath = '.tmp/data/mongod.log';

// If you don't want the logs, set true.
//embeddedMongoDB.silentMode(false);

console.log("embeddedMongoDB " + embeddedMongoDB.silentMode);


exports.start = function(callback) {
	embeddedMongoDB.start(null, null, function(err) {
		console.log('Started mongo for testing');
		callback(err);
		// mongodb://localhost:27017 is UP
	});
}

//embeddedMongoDB.start(null, null, function(err) {
// mongodb://localhost:27017 is UP
// created a local embedded/data/db folder and a local embedded/log file
//)};

exports.stop = function(callback) {
	embeddedMongoDB.stop(function(err) {
		console.log('Stopped mongo for testing');
		callback(err);
	});	
}

