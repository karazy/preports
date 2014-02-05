var PDFDocument = require('pdfkit'),
	pathHelper = require('path'),
	reports = require('../routes/reports');

exports.generatePdf = function(req, res) {
	var _id = req.params.id;

	if(!_id) {
		console.log('generatePdf: no report id given');
		res.send(404,'no report id given');
		return;
	}

	reports.findReport(_id, function(status, report) {
		if(status == 200) {
			generatePdf(report);
			res.send(200);
		} else {
			res.send(status);
		}
	});	

	// res.send(404,'Not implemented yet');
}


function generatePdf(report) {
	var doc = new PDFDocument(),
		path;

	path = pathHelper.join(getDocTmpPath(), report._id + '', report._id + '.pdf');

	doc.addPage({
		size: 'A4',
		layout: 'portrait'
	});

	doc.write(path);
}

function getDocTmpPath() {
	var userHome = getUserHome();

	return pathHelper.join(userHome, '.preports');
}

function getUserHome() {
  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}