'use strict';

var app = require('../app').app,
	mongo = require('../database/mongo'),
	expect = require('chai').expect,
	http = require('http'),
	request = require('supertest'),
	sinon = require('sinon'),
	fs = require('fs-extra'),
	// fixtures = require('pow-mongodb-fixtures').connect('preports'),
	// id = require('pow-mongodb-fixtures').createObjectId,
	config = require('../config/environment');


describe('When getting configured cost types', function() {

	it('should return a list with 2 records', function(done) {

	request(app)
      .get('/config/costtypes')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res){
    	if (err) throw err;
    		expect(res.body).to.have.length(2);
            expect(res.body[1].name).to.be.equal("Extern");
    		done();
  		});
	});
});

describe('When getting configured brand logo', function() {

	it('should return a binary image', function(done) {

	request(app)
      .get('/config/logo')
      .set('Content-Type', 'image/png')
      .set('Accept', 'image/png')
      .expect(200)
      .end(function(err, res){
    	if (err) throw err;
    		expect(res.body).to.not.be.null;
    		done();
  		});
	});
});