/**
* Helper class that init db connection and can be reused accros the application.
*/
var mongo = require('mongodb'),
	test = require('assert'),
	Db,
	Connection,
	Server,
	ObjectID,
	db,
	MAX_RETRIES = 10;

//setup mongo variables
Db = mongo.Db;
Connection = mongo.Connection;
Server = mongo.Server;
BSON = mongo.BSON;
ObjectID = mongo.ObjectID;
MongoClient = mongo.MongoClient; 


exports.createConnectionString = function() {
	var dbHost,
		dbPort,
		dbConnect;	   
	
	//Mongolab connection when deployed on Heroku
    if(typeof process.env.MONGOLAB_URI !== 'undefined') {
    	//kept for backwards compatibility use MONGODB_DB_CONNECTION instead
        console.log('Connecting to mongolab');
        dbConnect = process.env.MONGOLAB_URI;
    } else if(typeof process.env.MONGODB_DB_CONNECTION !== 'undefined') {
    	if(process.env.MONGODB_DB_CONNECTION.indexOf('mongodb://') == 0) {
    		console.log('TEST');
    	}
		console.log('Found MONGODB_DB_CONNECTION');
		dbConnect = process.env.MONGODB_DB_CONNECTION + '/preports';		
    } else {
    	dbHost = process.env.MONGODB_DB_HOST || 'localhost';
    	dbPort = process.env.MONGODB_DB_PORT || 27017;
        dbConnect = 'mongodb://' + dbHost + ":" + dbPort + '/preports';
    }

    return dbConnect;
}


exports.connect = function(connectionUrl) {

	console.log('Connecting to db: ' + connectionUrl);

    MongoClient.connect(connectionUrl, function(err, _db) {
    	//TODO add retry loop
        test.equal(null, err); 
        test.ok(_db != null);
        console.log("Connected to 'project report' database");
        db = _db;
        createIndexes();
    });
};

exports.getDB = function(cb) {
	var retryCount = 0;

	if(db) {
		if(cb) {
			cb(db);
		} else {
			return db;
		}
	} else {
		waitForConnect();
	}

	//Wait for a connection to the database for MAX_RETRIES
	function waitForConnect() {		
		if(!db && retryCount <= MAX_RETRIES) {
			console.log("Waiting for DB connection. Count=" + retryCount);

			setTimeout(function() {
				retryCount++;
				waitForConnect();
			}, 1000);
		} else {
			if(cb) {
				cb(db);
			} else {
				return db;
			}
		}
		
	}

	//if(!db && retryCount >= MAX_RETRIES) {
	//	throw new "No connection to database";
	//}

	return db;
}

/**
* Creates all indexes used by preports.
*/
function createIndexes() {
	getReportsCollection(doCreate);


	function doCreate(err, col) {
		if(err) {
			 console.log('createIndexes: ' + err);
			 return;
		}		

		col.createIndex('searchIndex',{
			'year' : 1,
			'name' : 1
		}, function(err, indexName) {
			if(err) {
				 console.log('createIndexes: failed to create index ' + err);
				 return;
			}	
			console.log('createIndexes: created index ' + indexName);
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
    		callback(null, reports_collection);
    	}
 	 });
}