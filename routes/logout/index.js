'use strict';
//FIXME currently not used since express 4.x is needed for router functionality.
var express = require('express');
var controller = require('./logout.controller');
var Authenticator = require('../../auth/authstrategy');
var router = express.Router();

router.get('/', Authenticator.logOut, controller.index);

module.exports = router;