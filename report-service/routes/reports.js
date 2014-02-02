var mongo = require('mongodb'),
	test = require('assert'),
	fs = require('fs'),
	mv = require('mv'),
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
 MongoClient.connect("mongodb://127.0.0.1:27017/preports", function(err, _db) {
  
  test.equal(null, err);
  test.ok(_db != null);
  console.log("Connected to 'project report' database");
  db = _db;


});

exports.getAll = function(req, res) {
	var results,
		searchYear = req.query.year,
		searchWeek = req.query.calweek,
		searchParams = {
			$or: [
				{ week: { $type: 16 } },
				{ week: { $type: 2 } },
				{ week: { $type: 1 } }
	        ],
	        $or: [
				{ year: { $type: 16 } },
				{ year: { $type: 2 } },
				{ year: { $type: 1 } }
	        ]				
		};

	getReportsCollection(callback);
	

	
	//debugObject(req.query, 'search query');
	//debugObject(searchParams, 'search params');

	// res.send([{name:'report1'}, {name:'report2'}, {name:'report3'}]);
	//  this.db= new Db('preports', new Server('localhost', 3000, {auto_reconnect: true}, {}));
 // this.db.open(function(){});
	 function callback(error, col) {
	 	if(searchYear) {
			searchParams.year = parseInt(req.query.year);
		}

		if(searchWeek) {
			searchParams.week = parseInt(req.query.calweek);


		}
	 	if(error) {
	 		res.send(404);
	 		return;
	 	}

	 	debugObject(searchParams, 'getAll: searchParams');
	 	
	 	res.setHeader('Content-Type', 'application/json');
	 	res.status(200);
	 	//exclude images
	 	col.find(searchParams, {'images' : 0}).toArray(function(err, items) {
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

	findReport(_id, function(status, report) {		
		res.send(status, report);
	});

}

function findReport(id, callback) {

	if(!id) {
		console.log('findReport: no id given');
	}

	getReportsCollection(loadReport);

	function loadReport(error, reports) {
		if(error) {
			callback(500);
			return;
		}

		reports.findOne({'_id': ObjectID.createFromHexString(id)}, function(err, item) {
			if(err) {
				console.log(err);
				callback(404);
			}
			// debugObject(item, 'findReport: report');
            callback(200, item)
        });
	}
}

function persistReportChanges(report, callback) {
	var _id = report._id;

	debugObject(report, 'persistReportChanges: report');
	delete report._id;

	getReportsCollection(doPersist);

	function doPersist(error, reports) {
		if(error) {
			callback(500);
			return;
		}

		//_id is already an object ID so no conversion
		reports.update({'_id':_id}, report, function(err) {
			if(err) {
				console.log(err);
				callback(500);
				return;
			}

			report._id = _id;

			callback(200, report);
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
		reports.insert(req.body, function(err, result) {
			if(err) {
				res.send(500)
			} else {				
				//TODO check if array
				res.send(200, result[0]);
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

	delete docToUpdate._id;
	
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

			docToUpdate._id = _id;

			console.log('Updated ' + numberOfUpdatedDocs + ' records');
			res.send(200, docToUpdate);
        });
	}
}

exports.deleteReport = function(req, res) {
	var _id = req.params.id;

	if(!_id) {
		console.log('deleteReport: no id given');
	}
	
	getReportsCollection(callback);

	//TODO delete images!

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

exports.uploadImage = function(req, res) {
	var _id = req.params.id,
		filename,		
		newFilename,
		image;

	// debugObject(req.files, 'uploadImage: req.files');
	if(!req.files || !req.files.image) {
		console.log('uploadImage: no image received');
		res.send(500);
		return;
	}

	function getFilename(image) {
		var index = image.path.lastIndexOf('/') + 1;

		return image.path.substring(index, image.path.length);
	}

	newFilename = '/Users/frederikreifschneider/karazy/nodejs/' + getFilename(req.files.image);

	mv(req.files.image.path, newFilename, function(err) {
	  console.log('uploadImage: failed to move image ' + err);
	});

	debugObject(req.files.image, 'uploadImage: req.files.image');
	// debugObject(req.files.image.ws, 'uploadImage: req.files.image.ws');

	console.log('uploadImage: received image ' + req.files.image.name);

	findReport(_id, function(status, report) {
		if(status != 404 && status != 500) {
			if(!report.images) {
				report.images = [];
			}

			image = {
				path: newFilename,
				name: req.files.image.name,
				_id: new ObjectID()
			};

			report.images.push(image);

			persistReportChanges(report, function(status, updatedReport) {
				if(status == 500) {
					res.send(500);
				} else {
					res.send(200, report);
				}
			});


		}
	})

	res.send(200);
}

exports.getImage = function(req, res) {
	var _id = req.params.id,
		imgId = req.params.imgId;

	// debugObject(req.params, 'getImage: params');
	getReportsCollection(loadReportImage);

	function loadReportImage(error, reports) {

		if(error) {
			callback(500);
			return;
		}

		reports.findOne({'_id': ObjectID.createFromHexString(_id), 'images._id' : ObjectID.createFromHexString(imgId)},
			 { images: { $elemMatch: { '_id': ObjectID.createFromHexString(imgId) } } } , function(err, item) {
			if(err) {
				console.log(err);
				res.send(500);
				return;
			}

			if(!item) {
				res.send(404);
				return;
			}

			// console.log('getImage: found Image ' + item);
			debugObject(item.images[0], 'Load image metadata');			

			readAndSendFile(item.images[0]);
			            
        });
	}

	function readAndSendFile(image) {
		var img = fs.readFileSync(image.path);
		res.contentLength = img.size;
		res.contentType = 'image/jpeg';
		res.status(200);
        res.end(img, 'binary');
	}
}

exports.deleteImage = function(req, res) {
	var _id = req.params.id,
		imgId = req.params.imgId;

	getReportsCollection(loadReportImage);

	function loadReportImage(error, reports) {
		var img;

		if(error) {
			callback(500);
			return;
		}

		reports.findOne({'_id': ObjectID.createFromHexString(_id), 'images._id' : ObjectID.createFromHexString(imgId)},
			 { images: { $elemMatch: { '_id': ObjectID.createFromHexString(imgId) } } } , function(err, item) {
			if(err) {
				console.log(err);
				res.send(500);
				return;
			}

			if(!item) {
				res.send(404);
				return;
			}

			// console.log('getImage: found Image ' + item);
			debugObject(item.images[0], 'Load image metadata');			

			deleteFile(reports, item.images[0]);
			            
        });
	}

	function deleteFile(col, img) {
		var imgId,
			path;

		if(!img) {
			res.send(500, 'No image found');
			return;
		}

		if(!img._id) {
			res.send(500, 'Image has no Id');
			return;
		}

		imgId = img._id;
		imgPath = img.path;

		// '_id': ObjectID.createFromHexString(_id), 'images._id' : ObjectID.createFromHexString(imgId)
		col.update( {}, 

			{ $pull: { 'images' :{ '_id' : imgId}}},
			{
				upsert: false,
				multi: true
			},
			function(err) {
				if(err) {
					console.log('deleteImage: delete failed ' + err);
					callback(500);
					return;
				}

				fs.unlink(imgPath, function(err) {
					if(err) {
						console.log('deleteImage: file already deleted? ' + err);
						res.send(500);
						return;
					}
					res.send(200);
				});
				
	        });		
		
	}
}

exports.getProjectNames = function(req, res) {

	getReportsCollection(getDistinctProjectNames);

	function getDistinctProjectNames(err, col) {
		col.distinct('name', function(err, values) {
			if(err) {
				res.send(500, err);
				return;
			}

			res.send(200, values);
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