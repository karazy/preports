var express = require('express'),
	reports = require('./routes/reports');

var app = express();

//define usages
app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
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
app.get('/reports/:id', reports.getById);
app.post('/reports', reports.createReport);
app.put('/reports/:id', reports.updateReport);
app.delete('/reports/:id', reports.deleteReport);


app.listen(3000);

console.log('project reports started');