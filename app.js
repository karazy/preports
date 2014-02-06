var express = require('express'),
	reports = require('./routes/reports'),
	pdfExport = require('./routes/pdfExport');

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  next();
}

//define usages
app.configure(function() {
	app.use(express.static(__dirname + '/app')); 
	app.use(express.bodyParser({ 
		keepExtensions: true
		// uploadDir: '~/Pictures/nodejs' 
	}));
	app.use(express.methodOverride());
	app.use(allowCrossDomain);
	app.use(app.router);
});


//define routes
app.get('/', function(req, res) {
	console.log('Displaying options');
	res.status(200);
	res.send('<h1>Reports CRUD API</h1>'+
			'<p><a href="/reports">GET /reports Get all reports</a></p>'+
			'<p>GET /reports/:id Get report via id</p>'+
			'<p>POST /reports Create new report</p>'+
			'<p>PUT /repors/:id Update or eplace report</p>'+			
			'<p>DELETE /reports/:id Delete report by id</p>'
			);	
});

//Reports CRUD API
app.get('/reports', reports.getAll);
app.get('/reports/names', reports.getProjectNames);
app.get('/reports/:id', reports.getById);
app.get('/reports/:id/images', reports.getReportImages);
app.get('/reports/:id/pdf', pdfExport.generatePdf);
app.post('/reports', reports.createReport);
app.put('/reports/:id', reports.updateReport);
app.post('/reports/:id/images', reports.uploadImage);
app.get('/reports/:id/images/:imgId', reports.getImage);
app.delete('/reports/:id/images/:imgId', reports.deleteImage);
app.delete('/reports/:id', reports.deleteReport);


app.listen(3000);

console.log('project reports started');