'use strict';

var nodemailer = require('nodemailer'),
	config = require('../../config/environment'),
	strTpl = require("string-template");

const PROVIDER_TYPE = 'email';
const SUBJECT_TPL = 'Project report {name} CW {week}|{year}';
const TEMPLATE = 'Project report for {name} - CW {week}|{year} is available under'+
			' {reportUrl} This is an automatically generated notification from preports.'; 

var transporter;

/*

	    contentLangKey = "notification.content.template",
	    subjectLangKey = "notification.subject.template",
	    isLive = true,
		PROVIDER_TYPE = 'email',
		SUBJECT_TPL = 'Project report {name} CW {week}|{year}',
		TEMPLATE = 'Project report for {name} - CW {week}|{year} is available under'+
			' {reportUrl} This is an automatically generated notification from preports.';
*/

/**
* Send notification.
*
*/
exports.send = function(report, callback, reportUrl) {
	var mailData = {},
		//keep track of number of users this is send to as well as the successful calls
		status = {
			usersToNotify: 0,
			send: 0
		},
		errors = [],
		recipients,
		handle = false;

	if(!isConfigValid()) {
		return;
	}

	recipients = report.settings.notification.recipients;

	if(!recipients || !recipients.length) {
		console.log('mail.send: report has no recipients');
		return;
	}

	report.reportUrl = reportUrl;
	mailData.subject = strTpl(SUBJECT_TPL, report);		
	mailData.text = strTpl(TEMPLATE, report);
	mailData.from = config.notificationProviders.mail.auth.user;

	//create one mail for each recipient and send it
	recipients.forEach(function(r) {
		if(r.type == PROVIDER_TYPE && r.email) {
			status.usersToNotify++;
			handle = true;

			mailData.to = r.email;
			console.log('mail.send: before send');
			transporter.sendMail(mailData, function(err, info) {

				status.send++;

				
				if(err) {
					errors.push(err);
					console.log('mail.send: error sending email ' + err);
				}

				if(status.send == status.usersToNotify) {
					if(errors.length > 0) {
						callback(false, formatErrors(errors));
					}

					callback(true);
				}
			});
		}
	});	

	if(!handle) {
		console.log('mail.send: No handlers found.');
		callback(true);
	}
}

exports.getProviderType = function() {
	return PROVIDER_TYPE;
}


function setupMailTransport() {

	var transportConfig;

	if(!isConfigValid()) {
		return;
	}

	transportConfig = config.notificationProviders.mail;

	transportConfig.pool = false;
	
	transporter = nodemailer.createTransport(transportConfig);
}

function isConfigValid() {

	if(!config || !config.notificationProviders) {
		console.log('mail.setupMailTransport: no providers setup');
		return false;
	}

	if(!config.notificationProviders.mail) {
		console.log('mail.setupMailTransport: mail provider config missing');
		return false;
	}

	return true;
}

/**
* Format the errors to return to caller.
*
*/
function formatErrors(errors) {
	var formatted = '';

	if(!errors || !errors.length) {
		return '';
	}

	errors.forEach(function(e) {
		formatted += e + '\n';
	});

	return formatted;
}

setupMailTransport();