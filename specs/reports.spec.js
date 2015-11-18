"use strict";

var app = require('../app').app,
	mongoHelper = require('./helpers/mongo'),
	mongo = require('../database/mongo'),
	expect = require('chai').expect,
	http = require('http'),
	request = require('supertest'),
	sinon = require('sinon'),
	fixtures = require('pow-mongodb-fixtures').connect('preports');




before(function(done) {
	//mongo.start();

	checkDbConnection();

	function checkDbConnection() {
		if(mongo.getDB() == null) {
			setTimeout(checkDbConnection, 50);
		} else {
			//Files
			console.log('Database is running... starting tests');
			fixtures.load(__dirname + '/helpers/fixtures.js', function() {
				console.log('Loaded fixtures');
				done();	
			});			
		}
	}
});

after(function(done) {
	fixtures.clear(function(err) {
	   console.log('Database cleaned.');
	   done();
	});
});


describe('When loading all reports', function() {
	beforeEach(function() {
		//this.request = sinon.stub(http, 'request');
	});

	afterEach(function() {
		//http.request.restore();
	});

	it('should return a 200', function(done) {

	request(app)
      .get('/reports')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
    	if (err) throw err;
    		expect(res.body.reports).to.have.length(2);
    		done();
  		});

	});
});


describe('When deleting a report', function() {
	it('should delete reports wiht missing files without exception', function() {
		
	});
});