var mongo = require('mongodb'),
	test = require('assert'),
	fs = require('fs-extra'),
	mv = require('mv'),
	pathHelper = require('path'),
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


connect = function(connectUrl) {

    MongoClient.connect(connectUrl, function(err, _db) {
        test.equal(null, err); 
        test.ok(_db != null);
        console.log("Connected to 'project report' database");
        db = _db;
         
    });
};

exports.setup = function(connectionUrl, uploadDirectory) {
    console.log("connecting to db: " + connectionUrl);
    connect(connectionUrl);
    console.log("directory for upload: " + uploadDirectory);
    uploadDir = uploadDirectory;
};

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

	 	// debugObject(searchParams, 'getAll: searchParams');
	 	
	 	res.setHeader('Content-Type', 'application/json');
	 	res.status(200);
	 	//include images needed for making copies. As alternative
	 	//exlclude {'images' : 0} and alter copy logic
	 	col.find(searchParams).toArray(function(err, items) {
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

exports.findReport = function(id, callback) {
	findReport(id, callback);
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
				callback(500, err);
				return;
			}

			if(!item) {
				callback(404);
				return;
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
	var	 reportToSave = req.body;

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

		debugObject(req.body, 'Insert new report');

		//This is a copy report. Assign new image ids.
		if(reportToSave.copyOf && reportToSave.images) {
			console.log('createReport: create a copy');

			for (var i = 0; i < reportToSave.images.length; i++) {
				//set a new object Id
				//Reusing the old id didn't work. Maybe mongodb creates an index. Sherlock investigate!
				reportToSave.images[i]._id = (new ObjectID()).toString();
				console.log('createReport: copied report! Assigning new id to image ' + reportToSave.images[i]._id);
			};
		}

		reports.insert(reportToSave, function(err, result) {
			if(err) {
				res.send(500);
			} else {
				
				if(reportToSave.copyOf && reportToSave.images) {
					//This is a copy report. Copy the images to new folder.
					copyReportImages(reportToSave.copyOf, result[0]._id, function(err) {
						if(err) {
							console.log('createReport: failed to copy images for ' + result[0]._id);
						}
					});
				}
				//result is an array
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
		var imgToDelete;
		if(error) {
			res.send(500);
			return;
		}
		//delete all images files
		reports.findOne({'_id': ObjectID.createFromHexString(_id)}, function(err, report) {
			if(report && report.images) {
				var imgPath = pathHelper.join(getImageUploadPath(), _id+''),
					imgFullPath;

        		for (var h = 0; h < report.images.length; h++) {
    				imgToDelete = report.images[h];
    				imgFullPath = pathHelper.join(imgPath,  imgToDelete.filename+'');	

    				fs.unlink(imgFullPath, function(err) {
						if(!err) {
							console.log('deleteReport: deleting image ' + imgFullPath);				
						} else {
							console.log('deleteReport: failed deleting image ' + imgFullPath);
						}
					});
        		}

        		fs.rmdir(imgPath, function(err) {
						if(!err) {
							console.log('deleteReport: deleting image dir ' + imgPath);											
						} else {
							console.log('deleteReport: failed deleting image dir ' + imgPath + ' Err: ' + err);
						}
				});
        	}
		});
		//each operates on the cursor but report object was always null.
		// .each(function(report) {
		// 	console.log('IMAGE DELETE BLABLA ' + report);
		// 	debugObject(report, 'IMAGE DELETE BLABLA');
		// 	if(report && report.images) {
  //       		for (var h = 0; h < report.images.length; h++) {
  //   				imgToDelete = report.images[h];
  //   				fs.unlink(imgToDelete.path, function(err) {
		// 				if(err) {
		// 					console.log('deleteReport: deleting image at ' + imgToDelete.path);				
		// 				}
		// 			});
  //       		}
  //       	}
		// });

		reports.remove({'_id': ObjectID.createFromHexString(_id)}, function(err, numberOfRemovedDocs) {
			if(err) {
				console.log(err);
				res.status(500);
				return;
			}
			console.log('Deleted report ' + _id);
			res.send(200);
        });
	}
}

exports.uploadImage = function(req, res) {
	var _id = req.params.id,
		filename,		
		newAbsFilename,
		uploadPath =  getImageUploadPath(),
		pathDelim = pathHelper.sep,
		image;

    //debugObject(req.files.image, 'uploadImage: req.files.image');
	if(!req.files || !req.files.image) {
		console.log('uploadImage: no image received');
		res.send(500);
		return;
	}

	filename = getFilename(req.files.image);

	/**
	* Return file name by extracting it from the path.
	*/
	function getFilename(image) {
		var index = image.path.lastIndexOf(pathDelim) + 1;
		return image.path.substring(index, image.path.length);
	}

	//TODO read folder from a config file
	newAbsFilename = pathHelper.join(uploadPath, _id, filename);

	console.log('uploadImage: Trying to move ' + req.files.image.path + ' to ' + newAbsFilename);

	try {
		fs.readdirSync(pathHelper.join(uploadPath, _id));
	} catch(err) {
		console.log('uploadImage: creating upload directory');
		fs.mkdirsSync(pathHelper.join(uploadPath, _id));
	}

	mv(req.files.image.path, newAbsFilename, function(err) {
		if(err) {
			console.log('uploadImage: failed to move image ' + err);
			res.send(500);
			return;
		} else {
			console.log('uploadImage: successfully moved image');
			//wait for file being moved to prevent file not shown because
			//request returns before moving is finished
			saveImageMetaData();
		}		
	  
	});

	//debugObject(req.files.image, 'uploadImage: req.files.image');
	// debugObject(req.files.image.ws, 'uploadImage: req.files.image.ws');

	//console.log('uploadImage: received image ' + req.files.image.name);
	function saveImageMetaData() {
		findReport(_id, function(status, report) {
			if(status != 404 && status != 500) {
				if(!report.images) {
					report.images = [];
				}
				//only store the filename. path can be created
				image = {
					'filename': filename,					
					'name': req.files.image.name,
					'_id': (new ObjectID()).toString()
				};

				//debugObject(image, 'uploadImage: add image metadata to currentReport ' + report._id);
				report.images.push(image);

				persistReportChanges(report, function(status, updatedReport) {
					if(status == 500) {
						res.send(500);
					} else {
						res.send(200, report);
					}
				});
			} else {
				res.send(status);
			}
		});
	}

	// res.send(200);
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

		//console.log('getImage: trying to load image ' + imgId);

		reports.findOne({'_id': ObjectID.createFromHexString(_id), 'images._id' : imgId},
			{ images: { $elemMatch: { '_id': imgId } } } ,
			  function(err, item) {
			//elemMatch is used to filter retrieved array
			if(err) {
				console.log(err);
				res.send(500);
				return;
			}

			if(!item) {
				console.log('getImage: image not found. _id ' + _id + ' imgId ' + imgId);
				res.send(404);
				return;
			}

			console.log('getImage: images ' + item.images.length);			
			debugObject(item.images[0], 'getImage: image loaded');	

			readAndSendFile(item.images[0]);
			            
        });
	}

	function readAndSendFile(image) {
		var img,
			imgPath;

		imgPath = pathHelper.join(getImageUploadPath(), _id , image.filename);
		console.log('getImage: loaded from path ' + imgPath);
		img = fs.readFileSync(imgPath);
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

		reports.findOne({'_id': ObjectID.createFromHexString(_id), 'images._id' : imgId},
			 { images: { $elemMatch: { '_id': imgId } } } , function(err, item) {
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
			// debugObject(item.images[0], 'Load image metadata');			

			deleteFile(reports, item.images[0]);
			            
        });
	}

	function deleteFile(col, img) {
		var imgId,
			path,
			uploadPath = getImageUploadPath();

		if(!img) {
			res.send(500, 'No image found');
			return;
		}

		if(!img._id) {
			res.send(500, 'Image has no Id');
			return;
		}

		imgId = img._id;
		imgPath = pathHelper.join(uploadPath, _id, img.filename);

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
						//continue nevertheless also the file may still exist					
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

exports.getReportImages = function(req, res) {
	var _id = req.params.id;
	//method is ment for debugging

	console.log('getReportImages');

	getReportsCollection(loadImageMetaData);

	function loadImageMetaData(err, reports) {
		if(err) {
			res.send(500, err);
			return;
		}

		reports.findOne({'_id': ObjectID.createFromHexString(_id)}, function(err, report) {
			debugObject(report.images, 'getReportImages: report.images');
			res.send(200, report.images);
		});
	}	
}

/**
* Copies all images of one report to another.
* Images are stored in {REPORTS_UPLOAD_DIR}/{REPORT_ID}.
* So we can simply copy the whole folder content.
*/
function copyReportImages(srcDirId, destDirId, callback) {
	var srcDir, 
		destDir,
		uploadPath = getImageUploadPath();

	//convert srcDir/destDir to string. otherwise pathHelper throws an error
	srcDir = pathHelper.join(uploadPath, srcDirId+''); 
	destDir = pathHelper.join(uploadPath, destDirId+'');

	try {
		fs.readdirSync(destDir);
	} catch(err) {
		console.log('uploadImage: creating upload directory ' + destDir);
		fs.mkdirsSync(destDir);
	}

	console.log('copyReportImages: copy from ' + srcDir + ' to ' + destDir);

	fs.copySync(srcDir, destDir, function(err) {
		if(err) {
			console.log('copyReportImages: copy failed ' + err);
		}
		callback(err);
	});
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

/**
* Returns the upload path for images.
*/
function getImageUploadPath() {
	var userHome = getUserHome();

	return pathHelper.join(userHome, '.preports');
}

function getUserHome() {
  if (typeof uploadDir === "undefined") {
        return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
    } else {
        return uploadDir;
    }
}