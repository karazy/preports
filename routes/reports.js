var mongodb = require('mongodb'),
	mongo = require('../database/mongo'),
	dbUtil = require('../database/util'),
	fs = require('fs-extra'),
	mv = require('mv'),
	queryString = require('querystring'),
	pathHelper = require('path'),
	htmlExport = require('./exporter/html'),
	config = require('../config/environment'),
	logger = require('../components/logger'),
	db;

ObjectID = mongodb.ObjectID;

//constants
var DB_DEFAULT_RESULT_LIMIT = 25,
	DATA_UPLOAD_PATH = '.preports';

exports.updateReportVersion = updateReportVersion;

exports.setup = function(uploadDirectory) {
    logger.info("directory for upload: " + uploadDirectory);
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
		sortProperty = req.query.sortProperty || 'week',
		sortDirection = req.query.sortDirection || 'asc',
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

	logger.debug('getAll: query params', req.query);

	if(req.accepts('text/plain') && !req.accepts('text/html')) {
		//TODO handle query params here as well?
		exports.getProjectNames(req, res);
		return;
	}

	//support json and hal+json type, otherwise return not acceptable
	if(!req.accepts('application/json') && !req.accepts('application/hal+json')  && !req.accepts('text/html')) {
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

		relLinkParams.sortProperty = req.query.sortProperty;
		relLinkParams.sortDirection = req.query.sortDirection;

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
				 logger.debug('getAll: sort options property=%s, direction=%s', sortProperty, sortDirection);
	 			//non opitimized pagination without rangeId
	 			skipFactor = nextPage * limit;
	 			sortParams = [[sortProperty, sortDirection]];
	 		}

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
			 		var reportsWithMeta = addMetaWrapperToReports(items, nextPage, limit, relLinkParams, count);

			 		//create html representation
			 		if(req.accepts('text/html')) {
			 			res.set('Content-Type', 'text/html');
			 			reportsWithMeta = htmlExport.transformReportList(reportsWithMeta);
			 			logger.info(reportsWithMeta);
			 		}

		            res.send(reportsWithMeta);
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
		logger.warn('addMetaWrapperToReports: no reports given')
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
				href: '/reports?page=' + (page-1) + '&limit=' + limit + '&' +  queryString.stringify(miscParams)
			}
		}

		if(page < (totalPages-1)) {
			wrapper._links['next'] = {
				//currentPage + '&next=' +
				href: '/reports?page=' + (page+1) + '&limit=' + limit  + '&' +  queryString.stringify(miscParams)
			}
		}
	}

	return wrapper;
}



exports.getById = function(req, res) {
	var _id = req.params.id;

	if(!_id) {
		logger.warn('getById: no id given');
	}

	logger.info('getById: load report with id ' + _id);	

	//support json and hal+json type, otherwise return not acceptable
	if(!req.accepts('application/json') && !req.accepts('application/hal+json')  && !req.accepts('text/html')) {
		res.status(406);
		res.end();
		return;
	}

	findReport(_id, function(status, report) {
		res.set('Content-Type', req.get('Accept'));
		res.status(200);

		//create html representation
 		if(req.accepts('text/html')) {
 			res.set('Content-Type', 'text/html');
 			report = htmlExport.transformReport(report);
 		}

		res.status(status).send(report);
		res.end();
	});

}

exports.findReport = function(id, callback) {
	findReport(id, callback);
}

function findReport(id, callback) {

	if(!id) {
		logger.warn('findReport: no id given');
	}

	getReportsCollection(loadReport);

	function loadReport(error, reports) {		
		if(error) {
			callback(500);
			return;
		}

		reports.findOne({'_id': ObjectID.createFromHexString(id)}, function(err, item) {
			if(err) {
				logger.info(err);
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
		logger.warn('addReportImageLinks: no image given');
		return;
	}

	if(!reportId) {
		logger.warn('addReportImageLinks: no reportId given');
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

/**
* Add given image to report.
* @param {Object} report
*	Report to add image to.
* @param {Object} image
*	Image to add.
* @param {Function} callback
*/
function persistReportImage(report, image, callback) {
	var _id = report._id,
		lastModified = (new Date()).getTime();

	debugObject(report, 'persistReportImage: report');
	delete report._id;

	getReportsCollection(doPersist);

	function doPersist(error, reports) {
		if(error) {
			callback(500);
			return;
		}

		report.lastModified = lastModified;

		//_id is already an object ID so no conversion
		reports.update({'_id':_id}, { 
			$push: {'images': image},
			$set: {'lastModified' : lastModified},
			$inc: {version: 1}
			}, function(err) {
			if(err) {
				logger.error(err);
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
		var _report,
			status = 200;

		if(error) {
			res.send(404);
			res.end();
			return;
		}

		//debugObject(req.body, 'Insert new report');

		reportToSave.lastModified = modifyDate;
		reportToSave.version = 1;
		//normalize name to make it sortable
		reportToSave.name_normalized = dbUtil.normalizeString(reportToSave.name);

		//This is a copy report. Assign new image ids.
		if(reportToSave.copyOf && reportToSave.images) {

			var dirToCheck = pathHelper.join(getUploadPath(), reportToSave.copyOf+''),
				validDir;

			validDir = isDirectory(dirToCheck);

			if(validDir) {
				logger.info('createReport: copy images');
				var invalidImages = [];
				for (var i = 0; i < reportToSave.images.length; i++) {
					var fileToCheck = pathHelper.join(getUploadPath(), reportToSave.copyOf+ '/' + reportToSave.images[i].filename);

					if(isFile(fileToCheck)) {
						//set a new object Id
						reportToSave.images[i]._id = (new ObjectID()).toString();
						logger.info('createReport: copied report! Assigning new id to image ' + reportToSave.images[i]._id);	
					} else {
						//File does not exist or is not a file
						status = 409;
						invalidImages.push(i);						
						logger.info("createReport: remove image with id  " + reportToSave.images[i]._id + " since its file could not be found");
					}										
				}

				//remove invalid images
				for (var h = 0; h < invalidImages.length; h++) {
					reportToSave.images = reportToSave.images.splice(invalidImages[h], 1);
				}

			} else {
				logger.warn('createReport: Cannot clone images. srcDir does not exist.');
				reportToSave.images = null;
				status = 409;
			}			
		}

		reports.insertOne(reportToSave, function(err, writeOpResult) {
			logger.debug("Called reports.insert");
			if(err) {
				res.send(500);
				res.end();
			} else {
				
				if(reportToSave.copyOf && reportToSave.images) {
					//This is a copy report. Copy the images to new folder.
					copyReportImages(reportToSave.copyOf, writeOpResult.ops[0]._id, function(err) {
						if(err) {
							logger.error('createReport: failed to copy images for ' + writeOpResult.ops[0]._id);
						}
					});
				}
				logger.info("Save success");
				debugObject(writeOpResult.ops[0], 'Saved record');
				//writeOpResult.ops is an array
				res.status(status).send(writeOpResult.ops[0]);
				res.end();
			}

		});

	}
}

exports.updateReport = function(req, res) {
	var _id = req.params.id,
		docToUpdate = req.body,
		lastModified = (new Date()).getTime();

	if(!_id) {
		logger.warn('updateReport: no id given');
		res.send(500);
		res.end();
		return;
	}

	if(!docToUpdate) {
		logger.warn('updateReport: no report given');
		res.sendStatus(500);
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

		reports.findOne({'_id': ObjectID.createFromHexString(_id)}, function(err, item) {
			if(err) {
				logger.error(err);
				callback(500, err);
				return;
			}

			if(!item) {
				callback(404);
				return;
			}

			//no changes in the meantime proceed
			if(item.version == docToUpdate.version || item.version == 'undefined') {
				doUpdate(reports);
			} else {
				//a new version was saved in between throw 428 Precondition Required and return current document
				res.send(428, 'Report was modified on server. Refresh needed.');
				res.end();
			}
		});
	}

	function doUpdate(reports) {
		docToUpdate.lastModified = lastModified;
		docToUpdate.name_normalized = dbUtil.normalizeString(docToUpdate.name);
		

		reports.updateOne({'_id': ObjectID.createFromHexString(_id)}, docToUpdate, function(err, numberOfUpdatedDocs) {
			if(err) {
				logger.error(err);
				res.status(500);
				res.end();
				return;
			}

			updateReportVersion(_id, docToUpdate, reports, function(success, reportWIncreasedVersion) {

				if(success) {
					res.status(200).send(reportWIncreasedVersion);
					res.end();	
				} else {
					res.send(500);
				}
				
			});
			
        });
	}
}

/**
* Increases the version of a given report.
* 
*/
function updateReportVersion(_id, report, collection, callback) {
	if(!_id || !report || !collection) {
		logger.warn('updateReportVersion: param requirements not met');
		return;
	}

	collection.updateOne({'_id': ObjectID.createFromHexString(_id)}, { $inc: { version: 1 } }, function(err, numberOfUpdatedDocs) {
		report._id = _id;
		//save an additional db load and manually increase version
		if(report.version) {
			report.version++;	
		} else {
			report.version = 1;
		}
		
		logger.info('Updated ' + _id + '  report. New version ' + report.version);
		
		if(!callback) {
			return;
		}

		if(!err) {
			callback(true, report);	
		} else {
			logger.info(err);
			callback(false);
		}
		
	});

}

/**
* Get version of a report.
*/
exports.getReportVersion = function(req, res) {
	var _id = req.params.id;

	if(!_id) {
		logger.warn('updateReportVersion: param requirements not met');
		return;
	}

	getReportsCollection(callback);

	function callback(error, reports) {
		if(error) {
			res.sendStatus(500);
			res.end();
			return;
		}

		reports.findOne({'_id': ObjectID.createFromHexString(_id)}, {'version':1}, function(err, item) {
			if(err) {
				logger.error(err);
				res.sendStatus(500);
				return;
			}

			if(!item) {
				res.sendStatus(404);
				return;
			}

			res.status(200).send(item);
			res.end();
		});
	}

}

exports.deleteReport = function(req, res) {
	var _id = req.params.id;

	if(!_id) {
		logger.warn('deleteReport: no id given');
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
				var imgPath = pathHelper.join(getUploadPath(), _id+''),
					imgFullPath;

        		for (var h = 0; h < report.images.length; h++) {
    				imgToDelete = report.images[h];
    				imgFullPath = pathHelper.join(imgPath,  imgToDelete.filename+'');	

    				fs.unlink(imgFullPath, function(err) {
						if(!err) {
							logger.info('deleteReport: deleting image ' + imgFullPath);				
						} else {
							logger.error('deleteReport: failed deleting image ' + imgFullPath);
						}
					});
        		}

        		fs.rmdir(imgPath, function(err) {
						if(!err) {
							logger.info('deleteReport: deleting image dir ' + imgPath);											
						} else {
							logger.error('deleteReport: failed deleting image dir ' + imgPath + ' Err: ' + err);
						}
				});
        	}
		});


		reports.remove({'_id': ObjectID.createFromHexString(_id)}, function(err, numberOfRemovedDocs) {
			if(err) {
				logger.error(err);
				res.status(500);
				res.end();
				return;
			}
			logger.info('Deleted report ' + _id);
			res.sendStatus(200);
			res.end();
        });
	}
}

exports.uploadImage = function(req, res) {
	var _id = req.params.id,
		filename,
		newAbsFilename,
		uploadPath =  getUploadPath(),
		pathDelim = pathHelper.sep,
		image;

	//no file upload in demo mode
	if(config.demo === true) {
		logger.info('uploadImage: no upload in demo mode');
		res.status(403).send("error.demo");
		res.end();
		return;
	}

    debugObject(req.file, 'uploadImage: req.file');

	if(!req.file) {
		logger.error('uploadImage: no image received');
		res.sendStatus(500);
		res.end();
		return;
	}

	filename = getFilename(req.file);

	/**
	* Return file name by extracting it from the path.
	*/
	function getFilename(image) {
		var index = image.path.lastIndexOf(pathDelim) + 1;
		return image.path.substring(index, image.path.length);
	}

	newAbsFilename = pathHelper.join(uploadPath, _id, filename);

	logger.info('uploadImage: Trying to move ' + req.file.path + ' to ' + newAbsFilename);

	try {
		fs.readdirSync(pathHelper.join(uploadPath, _id));
	} catch(err) {
		logger.error('uploadImage: creating upload directory');
		fs.mkdirsSync(pathHelper.join(uploadPath, _id));
	}

	mv(req.file.path, newAbsFilename, function(err) {
		if(err) {
			logger.error('uploadImage: failed to move image ' + err);
			res.sendStatus(500);
			res.end();
			return;
		} else {
			logger.info('uploadImage: successfully moved image');
			//TODO wait for file being moved to prevent file not shown because
			//request returns before moving is finished
			saveImageMetaData();
		}		
	  
	});

	function saveImageMetaData() {
		findReport(_id, function(status, report) {
			if(status != 404 && status != 500) {
				if(!report.images) {
					report.images = [];
				}
				//only store the filename. path can be created
				image = {
					'filename': filename,					
					'name': req.file.originalname,
					'_id': (new ObjectID()).toString()
				};

				addReportImageLinks(image, report._id);

				//debugObject(image, 'uploadImage: add image metadata to currentReport ' + report._id);
				// report.images.push(image);

				persistReportImage(report, image, function(status, updatedReport) {
					if(status == 500) {
						res.sendStatus(500);
						res.end();
					} else {
						res.status(200).send(image);
						res.end();
					}
				});
			} else {
				res.sendStatus(status);
				res.end();
			}
		});
	}
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

		logger.debug('getImage: trying to load image ' + imgId);

		reports.findOne({'_id': ObjectID.createFromHexString(_id), 'images._id' : imgId},
			{ images: { $elemMatch: { '_id': imgId } } } ,
			  function(err, item) {
			//elemMatch is used to filter retrieved array
			if(err) {
				logger.error(err);
				res.sendStatus(500);
				res.end();
				return;
			}

			if(!item) {
				logger.error('getImage: image not found. _id ' + _id + ' imgId ' + imgId);
				res.sendStatus(404);
				res.end();
				return;
			}

			logger.info('getImage: images ' + item.images.length);			
			debugObject(item.images[0], 'getImage: image loaded');	

			readAndSendFile(item.images[0]);
        });
	}

	function readAndSendFile(image) {
		var img,
			imgPath;

		imgPath = pathHelper.join(getUploadPath(), _id , image.filename);
		logger.info('getImage: loaded from path ' + imgPath);
		if(isFile(imgPath)) {
			img = fs.readFileSync(imgPath);
			res.contentLength = img.size;
			res.contentType = 'image/jpeg';
			res.status(200).end(img, 'binary');
		} else {
			res.sendStatus(404);
			res.end();
			return;
		}
		
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
				logger.error(err);
				res.sendStatus(500);
				res.end();
				return;
			}

			if(!item) {
				res.sendStatus(404);
				res.end();
				return;
			}

			// logger.info('getImage: found Image ' + item);
			// debugObject(item.images[0], 'Load image metadata');			

			deleteFile(reports, item.images[0]);
			            
        });
	}

	function deleteFile(col, img) {
		var imgId,
			path,
			uploadPath = getUploadPath();

		if(!img) {
			res.sendStatus(500, 'No image found');
			res.end();
			return;
		}

		if(!img._id) {
			res.sendStatus(500, 'Image has no Id');
			res.end();
			return;
		}

		imgId = img._id;
		debugObject(img, "IMAGE");
		
		imgPath = pathHelper.join(uploadPath, _id, img.filename);
		
		col.update({'_id': ObjectID.createFromHexString(_id)},
			{ 
				$pull: { 'images' :{ '_id' : imgId}},
				$set: {lastModified : (new Date()).getTime()},
				$inc: {version: 1}
			},
			{
				upsert: false,
				multi: true
			},
			function(err) {
				if(err) {
					logger.error('deleteImage: delete failed ' + err);
					callback(500);
					return;
				}

				fs.unlink(imgPath, function(err) {
					if(err) {
						logger.error('deleteImage: file already deleted? ' + err);
						//continue nevertheless also the file may still exist					
					}

					res.sendStatus(204);
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
				res.status(500).send(err);
				res.end();
				return;
			}

			res.set('Content-Type', 'text/plain');

			res.status(200).send(values);
			res.end();
		});
	}
}

exports.getReportImages = function(req, res) {
	var _id = req.params.id;
	//method is ment for debugging

	logger.debug('getReportImages');

	getReportsCollection(loadImageMetaData);

	function loadImageMetaData(err, reports) {
		if(err) {
			res.status(500).send(err);
			res.end();
			return;
		}

		reports.findOne({'_id': ObjectID.createFromHexString(_id)}, function(err, report) {
			debugObject(report.images, 'getReportImages: report.images');
			report.images.forEach(function(image) {
				addReportImageLinks(image, report._id);
			});

			res.status(200).send(report.images);
			res.end();
		});
	}	
}

/**
* Returns total count of all reports.
*
*/
exports.getReportsCount = function(req, res) {
	logger.debug('getReportsCount');

	getReportsCollection(countReports);

	function countReports(err, reports) {
		if(err) {
			res.status(500).send(err);
			res.end();
			return;
		}

		//TODO as soon as this is used often create an index and look out for performance issues

		logger.debug('getReportsCount: counting');
		reports.count(function(err, count) {
			logger.debug('getReportsCount: counted ' + count);
			//send as string otherwise interpreted as status
		    res.status(200).send(count +'');
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
		uploadPath = getUploadPath();

	//convert srcDir/destDir to string. otherwise pathHelper throws an error
	srcDir = pathHelper.join(uploadPath, srcDirId+''); 
	destDir = pathHelper.join(uploadPath, destDirId+'');

	try {
		fs.readdirSync(destDir);
	} catch(err) {
		logger.error('uploadImage: creating upload directory ' + destDir);
		fs.mkdirsSync(destDir);
	}

	logger.info('copyReportImages: copy from ' + srcDir + ' to ' + destDir);

	fs.copySync(srcDir, destDir, function(err) {
		if(err) {
			logger.error('copyReportImages: copy failed ' + err);
		}
		callback(err);
	});
}

/**
* Returns the reports collection.
* Creates it if it does not exist.
*/
getReportsCollection = function(callback) {
	 getDB(function(db) {
	 	db.collection('reports', function(error, collection) {
    	if( error ) {
    		logger.error('getReportsCollection: failed ' + error);
    		callback(error);
    	} else if(!collection) {
    		logger.info('getReportsCollection: creating collection reports');
    		db.createCollection('reports', function(_err, _collection) {
    			callback(_err, _collection);
    		});
    	} else {
    		callback(null, collection);
    	}
 	 });
 	 });
}


debugObject = function(obj, title) {
	if(!obj) {
		logger.error("No debug object given.");
		return;
	}

	logger.info('debugObject ' + title);

	try {
		for (var key in obj) {
	  if (obj.hasOwnProperty(key)) {
	  	logger.info('### ' + key + ' -> ' + obj[key]);
	  }
	}
	} catch(e) {
		logger.error('debugObject: failed to debug object ' + e);
	}
}


/**
* Returns the upload path for files (images).
* If a upload path is specified during initialization this one will be used otherwise 
* Users home dir + DATA_UPLOAD_PATH
*/
function getUploadPath() {
  if (typeof uploadDir === "undefined") {
        var userHome = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
        return pathHelper.join(userHome, DATA_UPLOAD_PATH);
    } else {
        return uploadDir;
    }
}

function getDB(cb) {
	if(cb) {
		mongo.getDB(function(db) {
			cb(db);
		});	
	} else {
		return mongo.getDB();
	}
	
}

/**
* Checks if given path is a directory.
* @return 
*	true if it is a directory.
* 	false if it is not a directory or does not exists at all
*/
function isDirectory(dir) {
	var dirStats;

	try {
		dirStats = fs.statSync(dir);
	} catch(e) {
		logger.info("isDirectory: dir "+dir+" does not exist");
		return false;
	}

	return dirStats.isDirectory();
}

/**
* Checks if given path is a file.
* @return 
*	true if it is a file.
* 	false if it is not a file or does not exists at all
*/
function isFile(file) {
	var stats;

	try {
		stats = fs.statSync(file);
	} catch(e) {
		logger.info("isFile: file "+file+" does not exist");
		return false;
	}

	return stats.isFile();
}