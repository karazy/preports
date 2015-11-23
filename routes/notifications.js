
var providerManager = require('./notification-providers'),
	config = require('../config/environment'),
	report = require('./reports');


/**
* Send notifications for given report id to all registered providers.
*
*/
exports.sendNotifications = function(req, res) {

	var _id = req.params.id;

	if(!_id) {
		console.log('sendNotifications: no id given');
		res.send(500, "Missing report id.");
		return;
	}

	//no sending of notifications
	if(config.demo === true) {
		console.log('sendNotifications: disabled in demo mode');
		res.send(403, "error.demo");
		res.end();
		return;
	}

	console.log('sendNotifications: for report with id ' + _id);	
	
	report.findReport(_id, doSend);

	function doSend(status, data) {
		var providers,
			providerCallFinished = 0,
			errors = [],
			reportUrl;

		if(status != 200) {
			res.send(status, data);
			res.end();
			return;
		}

		providers = providerManager.getProviders();
		reportUrl = createReportUrl(req, data);

		//send via registered providers
		providers.forEach(function(p) {
			providerCallFinished++;
			console.log('Calling provider ' + p.getProviderType());
			p.send(data, evaluateStatus, reportUrl);
		});

		function evaluateStatus(success, message) {
			if(!success) {
				if(Array.isArray(message)) {
					errors = errors.concat(message);
				} else {
					errors.push(message);	
				}				
			}

			//all calls finished send response
			if(providerCallFinished == providers.length) {
				if(errors.length == 0) {
					res.send(200);
					res.end();
				} else {
					res.send(500, errors);
					res.end();
				}
			}
		}		
	}

	function createReportUrl(request, report) {
		var url;

		url ='http://' + request.headers.host + '#/reports/' + report._id;

		return url;
	}

}

/* Templates from UI
 			"DE" : "Der technische Report fuer {{name}} - KW {{week}}|{{year}} ist verfuegbar unter"+
			" {{url}} Dies ist eine automatisch generierte Benachrichtigung von preports.",
			"EN" : "Technical report for {{name}} - CW {{week}}|{{year}} is available under"+
			" {{url}} This is an automatically generated notification from preports."
*/