'use strict';

var path = require('path');
var _ = require('lodash');

// if self signed CA
//http://stackoverflow.com/questions/20433287/node-js-request-cert-has-expired
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV || 'development',

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'trunk-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

};

/**
* If env var CONFIG_PATH is set path is
* CONFIG_PATH/$NODE_ENV.js
* otherwise
* ./$NODE_ENV.js
*/
function getEnvConfigPath() {
  var configPath = process.env.CONFIG_PATH;
  if(configPath) {
    //remove / at end
    if(configPath.substr(configPath.length - 1) === '/') {
      configPath = configPath.substr(0, configPath.length-1);
    }

    return process.env.CONFIG_PATH + '/' + all.env  + '.js';
  } else {
    return './' + all.env  + '.js';
  }
}

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require(getEnvConfigPath()) || {}
);