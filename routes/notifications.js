
var providerManager = require('./notification-providers'),
	//bisnode = require('./notification-providers/bisnode'),
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

	console.log('sendNotifications: for report with id ' + _id);	
	
	report.findReport(_id, doSend);

	function doSend(status, data) {
		var providers,
			providerCallFinished = 0,
			errors = [];

		if(status != 200) {
			res.send(status, data);
			res.end();
		}

		providers = providerManager.getProviders();

		//send via registered providers
		providers.forEach(function(p) {
			providerCallFinished++;
			p.send(data, evaluateStatus);
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

}

/* Templates from UI
 			"DE" : "Der technische Report fuer {{name}} - KW {{week}}|{{year}} ist verfuegbar unter"+
			" {{url}} Dies ist eine automatisch generierte Benachrichtigung von preports.",
			"EN" : "Technical report for {{name}} - CW {{week}}|{{year}} is available under"+
			" {{url}} This is an automatically generated notification from preports."
*/