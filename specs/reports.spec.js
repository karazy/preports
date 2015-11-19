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
			done();
		}
	}
});

after(function(done) {
	done();
});

function populateDB(cb) {
	//Files
	console.log('Database is running... starting tests');
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


describe('When loading all reports', function() {
	beforeEach(function(done) {
		populateDB(done);
	});

	afterEach(function(done) {
		cleanDB(done)
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
	beforeEach(function(done) {
		populateDB(done);
	});

	afterEach(function(done) {
		cleanDB(done);
	});

	it('should delete reports with missing files without exception', function(done) {
	
	request(app)
      .delete('/reports/564cf435f110b5ef6846f8dc')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
    	if (err) throw err;
    		//expect(res.body.reports).to.have.length(2);
    		done();
  		});
	});
});

describe('When updating a report', function() {
	beforeEach(function(done) {
		populateDB(done);
	});

	afterEach(function(done) {
		cleanDB(done);
	});

	it('should update reports with missing files without exception', function(done) {
	
	request(app)
      .put('/reports/564cf435f110b5ef6846f8dc')
      .send(
      {
	      "year": 2015,
	      "week": 50,
	      "name": "Report with missing file",
	      "milestones": [],
	      "lastModified": 1447883843607,
	      "version": 2,
	      "images": [
	        {
	          "filename": "26863-10sg1g3.jpg",
	          "name": "HEI12EW012000_0547.jpg",
	          "_id": "564cf443f110b5ef6846f8dd",
	          "_links": {
	            "self": {
	              "href": "/reports/564cf435f110b5ef6846f8dc/images/564cf443f110b5ef6846f8dd"
	            },
	            "collection": {
	              "href": "/reports/564cf435f110b5ef6846f8dc/images"
	            }
	          }
	        }
	      ],
	      "createdOn": "2015-11-18T21:57:09.000Z",
	      "_links": {
	        "self": {
	          "href": "/reports/564cf435f110b5ef6846f8dc"
	        },
	        "collection": {
	          "href": "/reports"
	        }
	      }
    	})
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
    	if (err) throw err;
    		//expect(res.body.reports).to.have.length(2);
    		done();
  		});
	});
});


describe('When deleting a report image', function() {
	beforeEach(function(done) {
		populateDB(done);
	});

	afterEach(function(done) {
		cleanDB(done);
	});

	it('should delete image meta data with missing files without exception', function(done) {
	
	request(app)
      .delete('/reports/564cf435f110b5ef6846f8dc/images/564cf443f110b5ef6846f8dd')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(204)
      .end(function(err, res){
    	if (err) throw err;
    		//expect(res.body.reports).to.have.length(2);
    		done();
  		});
	});
});