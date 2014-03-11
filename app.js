var express = require('express');
var reports = require('./routes/reports');
var crucible = require('./routes/crucible');
var pdfExport = require('./routes/pdfExport');

var app = express();

var App = function() {

    // Scope
    var self = this;

    // Setup
    self.ipaddr = process.env.OPENSHIFT_NODEJS_IP;
    self.port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 3000;

    self.dbHost = process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost";
    self.dbPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;


    if (typeof self.ipaddr === "undefined") {
        console.warn('No OPENSHIFT_NODEJS_IP environment variable');
        self.ipaddr = "localhost";
    }
    ;

    var allowCrossDomain = function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        next();
    };

    self.app = express();



//define usages
    self.app.configure(function() {
        self.app.use(express.static(__dirname + '/app'));
        self.app.use(express.bodyParser({
            keepExtensions: true
                    // uploadDir: '~/Pictures/nodejs' 
        }));
        self.app.use(express.methodOverride());
        self.app.use(allowCrossDomain);
        self.app.use(self.app.router);

        if (typeof process.env.OPENSHIFT_MONGODB_DB_USERNAME === "undefined") {
            self.dbConnect = "mongodb://" + self.dbHost + ":" + self.dbPort + "/preports";

        } else {
            console.log("logon with user: " + process.env.OPENSHIFT_MONGODB_DB_USERNAME);
            self.dbConnect = "mongodb://" + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":"
                    + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@"
                    + self.dbHost + ":" + self.dbPort + "/preports";
        }
        reports.setup(self.dbConnect, process.env.OPENSHIFT_DATA_DIR);
    });


    //define routes
    self.app.get('/', function(req, res) {
        console.log('Displaying options');
        res.status(200);
        res.send('<h1>Reports CRUD API</h1>' +
                '<p><a href="/reports">GET /reports Get all reports</a></p>' +
                '<p>GET /reports/:id Get report via id</p>' +
                '<p>POST /reports Create new report</p>' +
                '<p>PUT /repors/:id Update or eplace report</p>' +
                '<p>DELETE /reports/:id Delete report by id</p>'
                );
    });

//Reports CRUD API
    self.app.get('/reports', reports.getAll);
    self.app.get('/reports/names', reports.getProjectNames);
    self.app.get('/reports/:id', reports.getById);
    self.app.get('/reports/:id/images', reports.getReportImages);
    self.app.get('/reports/:id/pdf', pdfExport.generatePdf);
    self.app.post('/reports', reports.createReport);
    self.app.put('/reports/:id', reports.updateReport);
    self.app.post('/reports/:id/images', reports.uploadImage);
    self.app.get('/reports/:id/images/:imgId', reports.getImage);
    self.app.delete('/reports/:id/images/:imgId', reports.deleteImage);
    self.app.delete('/reports/:id', reports.deleteReport);
    self.app.get('/crucible/:id', crucible.getCrucible);

//starting the nodejs server with express
    self.startServer = function() {
        self.app.listen(self.port, self.ipaddr, function() {
            console.log('%s: Node server started on %s:%d ...', Date(Date.now()), self.ipaddr, self.port);
        });
    };

    // Destructors
    self.terminator = function(sig) {
        if (typeof sig === "string") {
            console.log('%s: Received %s - terminating Node server ...', Date(Date.now()), sig);
            process.exit(1);
        }
        ;
        console.log('%s: Node server stopped.', Date(Date.now()));
    };

    process.on('exit', function() {
        self.terminator();
    });

    self.terminatorSetup = function(element, index, array) {
        process.on(element, function() {
            self.terminator(element);
        });
    };

    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'].forEach(self.terminatorSetup);

};

//make a new express app
var app = new App();

//call the connectDb function and pass in the start server command
app.startServer();
