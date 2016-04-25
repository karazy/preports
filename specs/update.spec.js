'use strict';

var app = require('../app').app,
	mongo = require('../database/mongo'),
	expect = require('chai').expect,
	http = require('http'),
	request = require('supertest'),
	sinon = require('sinon'),
	fs = require('fs-extra'),
	fixtures = require('pow-mongodb-fixtures').connect('preports'),
	id = require('pow-mongodb-fixtures').createObjectId,
	config = require('../config/environment');

/**
 * Test update functions, executed after backwards INcompatible changes.
 */

before(function(done) {
	mongo.getDBPromise().then(function() {
		console.log('Database is running... starting tests');
		done();
	});
});

after(function(done) {
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


describe('When updating custom cost types from v1 to v2', function() {
	
    beforeEach(function(done) {
		populateDB(done);
	});

	afterEach(function(done) {
		cleanDB(done);
	});

	it('should update the model data', function(done) {
        
    request(app)
        .post('/migrate/costtypesv1tov2')
        .send()
        .expect(200)
        .end(function(err, res){
    	    if (err) throw err;
             
            expect(res.body.modified).to.be.equal(1);
            //use supertest-as-promised to avoid nested callbacks
            //https://www.npmjs.com/package/supertest-as-promised
            validate();
  		});
          
    function validate() {
        request(app)
        .get('/reports/564cf41ef110b5ef6846f8db')
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
    	    if (err) throw err;
            console.log("after migration");
            console.log(res.body);
            expect(res.body.costs).to.not.be.null;
            expect(res.body.costs).to.have.lengthOf(3);
    		done();
  		});
    }      
    });
});