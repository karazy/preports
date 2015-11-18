"use strict";

var app = require('../app').app,
	mongoHelper = require('./helpers/mongo'),
	mongo = require('../database/mongo'),
	chai = require('chai'),
	http = require('http'),
	request = require('supertest'),
	sinon = require('sinon');


before(function(done) {
	//mongo.start();

	checkDbConnection();

	function checkDbConnection() {
		if(mongo.getDB() == null) {
			setTimeout(checkDbConnection, 50);
		} else {
			done();
		}
	}

});

describe('When loading all reports', function() {
	beforeEach(function() {
		//this.request = sinon.stub(http, 'request');
	});

	afterEach(function() {
		//http.request.restore();
	});

	it('should return a 200', function(done) {
	/*	var req = {
			accepts: 'application/json'
		};

		req.query = {
			limit: 25,
			page: 0,
			year: 2015
		}
*/
//console.log(app);
	request(app)
      .get('/reports')
      .set('Accept', 'application/json')
      .expect(200, done);

	});
});


describe('When deleting a report', function() {
	it('should delete reports wiht missing files without exception', function() {
		
	});
});