var mongo = require('mongodb'),
	test = require('assert'),
	Db,
	Connection,
	Server,
	ObjectID,
	db;

Db = mongo.Db;
Connection = mongo.Connection;
Server = mongo.Server;
BSON = mongo.BSON;
ObjectID = mongo.ObjectID;
MongoClient = mongo.MongoClient; 


//connect to db new way
 MongoClient.connect("mongodb://localhost:27017/preports", function(err, _db) {
  
  test.equal(null, err);
  test.ok(_db != null);
  console.log("Connected to 'project report' database");
  db = _db;


});

exports.getAll = function(req, res) {
	var results,
		searchYear = req.query.year;

	getReportsCollection(callback);
	debugObject(req.query, 'search params');

	// res.send([{name:'report1'}, {name:'report2'}, {name:'report3'}]);
	//  this.db= new Db('preports', new Server('localhost', 3000, {auto_reconnect: true}, {}));
 // this.db.open(function(){});
	 function callback(error, col) {
	 	if(error) {
	 		res.send(404);
	 		return;
	 	}
	 	
	 	res.setHeader('Content-Type', 'application/json');
	 	res.status(200);
	 	
	 	col.find({
	 		'year' : searchYear
	 	}).toArray(function(err, items) {
            res.send(items);
        });
	 
 	} 	
}

exports.getById = function(req, res) {
	var _id = req.params.id;

	if(!_id) {
		console.log('getById: no id given');
	}

	console.log('getById: load report with id ' + _id);

	getReportsCollection(callback);

	function callback(error, reports) {
		if(error) {
			res.send(500);
			return;
		}

		reports.findOne({'_id': ObjectID.createFromHexString(_id)}, function(err, item) {
			if(err) {
				console.log(err);
				res.status(404);
				return;
			}
			debugObject(item, 'Load report');
			res.status(200);
            res.send(item);
        });
	}

}

exports.createReport = function(req, res) {
	if(!req.body) {
		return;		
	}

    getReportsCollection(callback);

	function callback(error, reports) {
		var _report;

		if(error) {
			res.send(404);
			return;
		}

		debugObject(req.body, 'Insert new report')
		reports.insert(req.body, function(err) {
			if(err) {
				res.send(500)
			} else {
				res.send(200);
			}

		});		

	}
}

exports.updateReport = function(req, res) {
	var _id = req.params.id,
		docToUpdate = req.body;

	if(!_id) {
		console.log('updateReport: no id given');
		res.send(500);
		return;
	}

	if(!docToUpdate) {
		console.log('updateReport: no report given');
		res.send(500);
		return;
	}
	
	getReportsCollection(callback);

	function callback(error, reports) {
		if(error) {
			res.send(500);
			return;
		}

		reports.update({'_id': ObjectID.createFromHexString(_id)}, docToUpdate, function(err, numberOfUpdatedDocs) {
			if(err) {
				console.log(err);
				res.status(500);
				return;
			}

			console.log('Updated ' + numberOfUpdatedDocs + ' records');
			// res.status(200);
			res.send(200);
        });
	}
}

exports.deleteReport = function(req, res) {
	var _id = req.params.id;

	if(!_id) {
		console.log('deleteReport: no id given');
	}
	
	getReportsCollection(callback);

	function callback(error, reports) {
		if(error) {
			res.send(500);
			return;
		}

		reports.remove({'_id': ObjectID.createFromHexString(_id)}, function(err, numberOfRemovedDocs) {
			if(err) {
				console.log(err);
				res.status(500);
				return;
			}
			console.log('Removed ' + numberOfRemovedDocs + ' records');
			// res.status(200);
			res.send(200);
        });
	}
}

getReportsCollection = function(callback) {
	 db.collection('reports', function(error, reports_collection) {
    	if( error ) {
    		console.log('getReportsCollection: error');
    		callback(error);
    	} else if(!reports_collection) {
    		console.log('getReportsCollection: creating collection reports');
    		db.createCollection('reports', function(_err, _collection) {
    			callback(_err, _collection);
    		});
    	} else {
    		console.log('getReportsCollection: found');
    		callback(null, reports_collection);
    	}
 	 });
}


debugObject = function(obj, title) {
	if(!obj) {
		return;
	}

	console.log('debugObject ' + title);

	try {
		for (var key in obj) {
	  if (obj.hasOwnProperty(key)) {
	  	console.log('### ' + key + ' -> ' + obj[key]);
	  }
	}
	} catch(e) {
		console.error('RepV.util.Helper.debugObject: failed to debug object ' + e);
	}
}