'use strict';

var _ = require('lodash');
var logger = require('../../components/logger');
var authentication = require('../../auth/authstrategy');

// Get list of logouts
exports.index = function(req, res) {
	authentication.logout(req,res);
};