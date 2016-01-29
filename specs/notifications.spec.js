"use strict";

var app = require('../app').app,
	mongo = require('../database/mongo'),
	expect = require('chai').expect,
	http = require('http'),
	request = require('supertest'),
	sinon = require('sinon'),
	fs = require('fs-extra'),
	fixtures = require('pow-mongodb-fixtures').connect('preports'),
	id = require('pow-mongodb-fixtures').createObjectId,
	config = require('../config/environment'),
	notifications = require('../routes/notifications');


before(function(done) {

	fs.mkdirsSync('.tmp/.preports');
	fs.copySync('./specs/data', '.tmp/.preports/', function (err) {
	  console.log('Copied test files');
	});

	mongo.getDBPromise().then(function() {
		console.log('Database is running... starting tests');
		done();
	});
});

after(function(done) {
	fs.removeSync('.tmp/', function (err) {
	  if (err) return console.error(err)

	  console.log('Removed test files!')
	});
	done();
});

function populateDB(cb) {
	//Files	
	fixtures.load(__dirname + '/helpers/fixtures.js', function() {
		console.log('Loaded fixtures');
		cb();	
	});		
}

function cleanDB(cb) {
	fixtures.clear(function(err) {
	   console.log('Database cleaned.');
	   cb();
	});
}

describe('When sending notifications', function() {
	beforeEach(function(done) {
		populateDB(done);
	});

	afterEach(function(done) {
		cleanDB(done);
	});
	

	it('no error should be thrown if recipients are empty', function(done) {
		request(app)
		    .post('/reports/564cf41ef110b5ef6846f8db/notifications/')
		    .expect(200, done);
	});
});


describe('When demo mode is active', function() {
	beforeEach(function(done) {
		populateDB(done);
		config.demo = true;
	});

	afterEach(function(done) {
		cleanDB(done);
		config.demo = false;
	});
	

	it('sending notifications should be rejected', function(done) {
		request(app)
		    .post('/reports/564cf41ef110b5ef6846f8db/notifications/')
		    .expect(403, done);
	});
});

describe('When loading configured provider', function() {
	var providers;
	it('should return an array with 2 objects', function(done) {
		request(app)
		    .get('/notifications/providers')
		    .expect(200)
		    .end(function(err, res) {
	    		if (err) throw err;
	    		expect(res.body).to.have.length(2);
	    		expect(res.body[0].provider).to.equal('slack');
	    		expect(res.body[0].display).to.equal('Slack');
	    		done();
	  		});
	});
});
