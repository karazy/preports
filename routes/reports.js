var mongo = require('mongodb'),
	test = require('assert'),
	fs = require('fs-extra'),
	mv = require('mv'),
	queryString = require('querystring'),
	pathHelper = require('path'),
	Db,
	Connection,
	Server,
	ObjectID,
	db;

//constants
var DB_DEFAULT_RESULT_LIMIT = 5;

//setup mongo variables
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

        createIndexes();
    });
};

/**
* Creates all indexes used by preports.
*/
function createIndexes() {
	getReportsCollection(doCreate)


	function doCreate(err, col) {
		if(err) {
			 console.log('createIndexes: ' + err);
			 return;
		}		

		col.ensureIndex({
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

exports.setup = function(connectionUrl, uploadDirectory) {
    console.log("connecting to db: " + connectionUrl);
    connect(connectionUrl);
    console.log("directory for upload: " + uploadDirectory);
    uploadDir = uploadDirectory;
};

/**
* Get all reports based on given query parameters.
* @param {Object} req
*	The request object.
*	- req.query.year
*	- req.query.week
*	- req.query.name
*	- req.query.page
*	- req.query.next
*	- req.query.limit
*	- req.query.rangeid
* @param {Object} res
*	The response object.
*/
exports.getAll = function(req, res) {
	var results,
		year = req.query.year || (new Date()).getFullYear(),
		week = req.query.week,
		limit = req.query.limit || DB_DEFAULT_RESULT_LIMIT,
		page = req.query.page || 0,
		nextPage = req.query.next || page,
		rangeId = req.query.rangeid,
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
		},
		relLinkParams = {},
		count,
		totalPages,
		skipFactor = 0;

	debugObject(req.query, 'getAll: query params');	



	if(req.accepts('text/plain')) {
		//TODO handle query params here as well?
		exports.getProjectNames(req, res);
		return;
	}

	//support json and hal+json type, otherwise return not acceptable
	if(!req.accepts('application/json') && !req.accepts('application/hal+json')) {
		res.status(406);
		res.end();
		return;
	}

	getReportsCollection(callback);

	 function callback(error, col) {
	 	var sortParams;

	 	if(error) {
	 		res.send(404);
	 		res.end();
	 		return;
	 	}

	 	if(year) {
			searchParams.year = parseInt(year);
			relLinkParams.year = parseInt(year);
		}

		if(week) {
			searchParams.week = parseInt(week);
			relLinkParams.week = parseInt(week);
		}

		if(req.query.name) {
			searchParams.name = RegExp(".*" + req.query.name +".*", 'i');
			relLinkParams.name = req.query.name;
		}

		limit = parseInt(limit);
		page = parseInt(page);
		nextPage = parseInt(nextPage);		

	 	// debugObject(searchParams, 'getAll: searchParams');	 	
	 	col.count(searchParams, function(err, result) {
	 		count = result;
	 		totalPages = (count) ? Math.floor(count/limit) : 0;
	 		if(nextPage >= totalPages && totalPages > 0) {
	 			//-1 because paging counts from 0
	 			nextPage = totalPages;
	 		} else if(nextPage < 0) {
	 			nextPage = 1;
	 		}

	 		//create ranged query for better performance
	 		//NOT WORKING since we first have to sort for year and week!
	 		//Changing a week afterwards can change the initial order and the $gt and $lt
	 		//will not work.
	 		if(rangeId) {
	 			sortParams = [['year','asc'], ['week','asc'], ['_id','asc']];
	 			if(nextPage == page) {
	 				searchParams['_id'] = {
		 				 $gt: ObjectID.createFromHexString(rangeId)
		 			}
	 				skipFactor = 0;
	 			} else if(nextPage > page) {
	 				searchParams['_id'] = {
		 				 $gt: ObjectID.createFromHexString(rangeId)
		 			}

		 			skipFactor = (nextPage-page)*limit-1;
	 			} else {
	 				//Going back gets more expensive when we are on the last page!
	 				//Then its like plain skipping everything from the beginning. 
	 				//Think about a solution when this imposes a problem.
	 				searchParams['_id'] = {
		 				 $lt: ObjectID.createFromHexString(rangeId)
		 			}
		 			skipFactor = nextPage*limit;
	 			}	 			
	 		} else {
	 			//non opitimized pagination without rangeId
	 			skipFactor = nextPage * limit;
	 			sortParams = [['year','asc'], ['week','asc']];
	 		}
	 		//debugObject(searchParams, 'getAll: searchParams');
	 		//debugObject(searchParams._id, 'getAll: searchParams_id');	
	 		// console.log('skipFactor ' + skipFactor);

	 	//images included needed for making copies. As alternative
	 	//exlclude {'images' : 0} and alter copy logic
		var options = {
		    "limit": limit,
		    "skip": skipFactor,
		    "sort": sortParams
		}
		// debugObject(options, 'getAll: options');	
	 	//ranged pagination based on 
	 	//http://stackoverflow.com/questions/9703319/mongodb-ranged-pagination
		 	col.find(searchParams, options)		
		 		.toArray(function(err, items) {
		 			if(items) {
		 				items.forEach(function(report) {
			 				addReportMetadata(report);
			 			});	
		 			}
			 		res.set('Content-Type', req.get('Accept'));
			 		res.status(200);
		            res.send(addMetaWrapperToReports(items, nextPage, limit, relLinkParams, count));
		            res.end();
	        });	 
	 	});
 	} 	
}

/*
* Adds totalCount, totalPages and currentPage properties.
* Also adds self, next and prev links.
*/
function addMetaWrapperToReports(reports, page, limit, miscParams, count) {
	var wrapper = {},
		totalCount = count || 0,
		totalPages = (count) ? Math.ceil(count/limit) : 1,
		currentPage = page,
		rangeId = '';

	if(!reports) {
		console.log('addMetaWrapperToReports: no reports given')
		return;
	}

	// if(reports.length > 0) {
	// 	rangeId = '&rangeid=' + reports[0]._id;
	// }

	wrapper.reports = reports;

	wrapper._links = {
		self : {
			href: '/reports?page=' + currentPage + '&limit=' + limit + '&' + queryString.stringify(miscParams)
		}
	}

	//this is for displaying purpose, so we add +1 since counting is zero based
	wrapper['totalCount'] = totalCount;
	wrapper['totalPages'] = totalPages;
	wrapper['currentPage'] = currentPage + 1;

	if(totalPages > 1) {
		//add prev and next links
		if(page > 0 && totalPages > 1) {
			wrapper._links['prev'] = {
				//currentPage + '&next=' +
				href: '/reports?page=' + (page-1) + '&limit=' + limit + '&' + queryString.stringify(miscParams)
			}
		}

		if(page < (totalPages-1)) {
			wrapper._links['next'] = {
				//currentPage + '&next=' +
				href: '/reports?page=' + (page+1) + '&limit=' + limit  + '&' + queryString.stringify(miscParams)
			}
		}
	}

	return wrapper;
}



exports.getById = function(req, res) {
	var _id = req.params.id;

	if(!_id) {
		console.log('getById: no id given');
	}

	console.log('getById: load report with id ' + _id);		

	findReport(_id, function(status, report) {
		res.send(status, report);
		res.end();
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

			addReportMetadata(item);

			//lock reports to prevent accidential edit, that have a modified date older than 6 days
			//or that have none at all (reports from an old version)
			if(item.lastModified) {
				var now = new Date(),
					timeDiff,
					diffDays;
				// var lastModified = new Date(item.lastModified);
				timeDiff = Math.abs(item.lastModified - now.getTime());
				diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
				
				if(diffDays >= 6 ) {
					item.locked = true;
				}
			} else {
				item.locked = true;
			}
			

			// debugObject(item, 'findReport: report');
            callback(200, item);
        });
	}
}

/**
* Adds additional metadata to the report.
* This includes hypermedia links for API navigation and createdOn.
*/
function addReportMetadata(report) {	
	if(!report) {
		return;
	}

	report.createdOn = report._id.getTimestamp();


	if(!report._links) {
		report._links = {};	
	}
	
	report._links = {
		'self' : { 
			'href': '/reports/' + report._id
		},
		'collection' : {
			'href' : '/reports'
		}
	}
	//if a report has images, add self links to them as well
	if(report.images) {
		report.images.forEach(function(image) {
			addReportImageLinks(image, report._id);
		});
	}

	return report;
}

function addReportImageLinks(image, reportId) {
	if(!image) {
		console.log('addReportImageLinks: no image given');
		return;
	}

	if(!reportId) {
		console.log('addReportImageLinks: no reportId given');
		return;
	}

	if(!image._links) {
		image._links = {};	
	}

	image._links = {
		'self' : { 
			'href': '/reports/' + reportId + '/images/' + image._id
		},
		'collection' : {
			'href' : '/reports/' + reportId + '/images'
		}	
	}

	return image;
}

function persistReportChanges(report, callback) {
	var _id = report._id,
		lastModified = (new Date()).getTime();

	debugObject(report, 'persistReportChanges: report');
	delete report._id;

	getReportsCollection(doPersist);

	function doPersist(error, reports) {
		if(error) {
			callback(500);
			return;
		}

		report.lastModified = lastModified;

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
	var	 reportToSave = req.body,
		modifyDate = (new Date()).getTime();

	if(!req.body) {
		return;		
	}

    getReportsCollection(callback);

	function callback(error, reports) {
		var _report;

		if(error) {
			res.send(404);
			res.end();
			return;
		}

		debugObject(req.body, 'Insert new report');

		reportToSave.lastModified = modifyDate;

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
				res.end();
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
				res.end();
			}

		});

	}
}

exports.updateReport = function(req, res) {
	var _id = req.params.id,
		docToUpdate = req.body,
		lastModified = (new Date()).getTime();;

	if(!_id) {
		console.log('updateReport: no id given');
		res.send(500);
		res.end();
		return;
	}

	if(!docToUpdate) {
		console.log('updateReport: no report given');
		res.send(500);
		res.end();
		return;
	}

	delete docToUpdate._id;
	
	getReportsCollection(callback);

	function callback(error, reports) {
		if(error) {
			res.send(500);
			res.end();
			return;
		}

		docToUpdate.lastModified = lastModified;

		reports.update({'_id': ObjectID.createFromHexString(_id)}, docToUpdate, function(err, numberOfUpdatedDocs) {
			if(err) {
				console.log(err);
				res.status(500);
				res.end();
				return;
			}

			docToUpdate._id = _id;

			console.log('Updated ' + numberOfUpdatedDocs + ' records');
			res.send(200, docToUpdate);
			res.end();
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
		var imgToDelete;
		if(error) {
			res.send(500);
			res.end();
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
				res.end();
				return;
			}
			console.log('Deleted report ' + _id);
			res.send(200);
			res.end();
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
		res.end();
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
			res.end();
			return;
		} else {
			console.log('uploadImage: successfully moved image');
			//TODO wait for file being moved to prevent file not shown because
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

				addReportImageLinks(image, report._id);

				//debugObject(image, 'uploadImage: add image metadata to currentReport ' + report._id);
				report.images.push(image);

				persistReportChanges(report, function(status, updatedReport) {
					if(status == 500) {
						res.send(500);
						res.end();
					} else {
						res.send(200, image);
						res.end();
					}
				});
			} else {
				res.send(status);
				res.end();
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
				res.end();
				return;
			}

			if(!item) {
				console.log('getImage: image not found. _id ' + _id + ' imgId ' + imgId);
				res.send(404);
				res.end();
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
				res.end();
				return;
			}

			if(!item) {
				res.send(404);
				res.end();
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
			res.end();
			return;
		}

		if(!img._id) {
			res.send(500, 'Image has no Id');
			res.end();
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
					res.end();
				});
				
	        });		
		
	}
}

/**
* 
* Returns all distinct project report names.
*/
exports.getProjectNames = function(req, res) {

	getReportsCollection(getDistinctProjectNames);

	function getDistinctProjectNames(err, col) {
		col.distinct('name', function(err, values) {
			if(err) {
				res.send(500, err);
				res.end();
				return;
			}

			res.set('Content-Type', 'text/plain');

			res.send(200, values);
			res.end();
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
			res.end();
			return;
		}

		reports.findOne({'_id': ObjectID.createFromHexString(_id)}, function(err, report) {
			debugObject(report.images, 'getReportImages: report.images');
			report.images.forEach(function(image) {
				addReportImageLinks(image, report._id);
			});

			res.send(200, report.images);
			res.end();
		});
	}	
}

/**
* Returns total count of all reports.
*
*/
exports.getReportsCount = function(req, res) {
	console.log('getReportsCount');

	getReportsCollection(countReports);

	function countReports(err, reports) {
		if(err) {
			res.send(500, err);
			res.end();
			return;
		}

		//TODO as soon as this is used often create an index and look out for performance issues

		console.log('getReportsCount: counting');
		reports.count(function(err, count) {
			console.log('getReportsCount: counted ' + count);
			//send as string otherwise interpreted as status
		    res.send(200, count +'');
		    res.end();
		    return;
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

/**
* Get calendar week of given date.
* @param {Date} date
*	Date to get week for.
* @return 
*	week in year
*/
function getWeek(date) {
    var onejan = new Date(date.getFullYear(), 0, 1);
    return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}