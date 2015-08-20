'use strict';

var logger = require('../logger');
var config = require('../../config/environment');

module.exports = function() {

	function isNonEmpty(arrayToCheck) {
		return typeof arrayToCheck !== 'undefined' && arrayToCheck.length > 0;
	}

	/**
	 * @return an array of allowed groups for the application, never null
	 */
	function getAllowedGroups(applicationDescription) {
		if (applicationDescription.hasOwnProperty('accessControl') && applicationDescription.accessControl.hasOwnProperty('allowedGroups')) {
			return applicationDescription.accessControl.allowedGroups;
		}
		return [];
	}

	function isAllowedApplication(userName, userGroups, applicationDescription) {
		var allowedGroups = getAllowedGroups(applicationDescription);

		if (isNonEmpty(allowedGroups)) {
			if (allowedGroups.indexOf('_all') > -1) { 
				// everyone is allowed to use this app, needs to be authenticated of course
				return true;
			}

			if (userGroups && userGroups.length > 0) {
				for (var i = 0; i < allowedGroups.length; i++) {
					var group = allowedGroups[i];
					var stringToCheck = 'CN=' + group + ',';
					var groupIndex = userGroups.indexOf(stringToCheck);
					if (groupIndex > -1) {
						// user has belongs to at least one of the allowed groups
						logger.debug('Found matching group ' + group + ' for user ' + userName);
						return true;
					}
				}
			} else {
				// user has no groups, deny access
			}

		}

		return false;
	}

	function getUserGroups(user) {
		var userGroups = null;
		if (user.hasOwnProperty('attributes')) {
			var attributes = user.attributes;
			if (attributes.hasOwnProperty('memberof')) {
				//console.log('MEMBER OF: %s', attributes.memberof );
				userGroups = attributes.memberof;
			}
		}	
		return userGroups;	
	}

	function filterAllowedApplications(user, applicationDescriptions) {
 		if(config.authentication.disabled) {
 			logger.warn('Skip access control request!');
            return applicationDescriptions;
        }

        //console.log('USER: %o', user);
        var allowedApplications = [];
		var userName = user.user;
		var userGroups = getUserGroups(user);
		
		for (var i = 0; i < applicationDescriptions.length; i++) {
			var applicationDescription = applicationDescriptions[i];
			if (isAllowedApplication(userName, userGroups, applicationDescription)) {
				allowedApplications.push(applicationDescription);
			}
		}			
	

		logger.debug('No matching group found for user ' + userName);
		return allowedApplications;
	}

	return {
		filterAllowedApplications : filterAllowedApplications
	}
 

}();