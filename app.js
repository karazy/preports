var http = require('http');
var express = require('express');
var reports = require('./routes/reports');
var crucible = require('./routes/crucible');

var app = express();

var App = function() {

    // Scope
    var self = this;

    // Setup
    self.ipaddr = process.env.OPENSHIFT_NODEJS_IP;
    self.port = parseInt(process.env.OPENSHIFT_NODEJS_PORT) || 3000;

    self.dbHost = process.env.MONGODB_DB_HOST || process.env.OPENSHIFT_MONGODB_DB_HOST || "localhost";
    self.dbPort = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
    self.uploadDir = process.env.UPLOAD_DIR || process.env.OPENSHIFT_DATA_DIR;


    if (typeof self.ipaddr === "undefined") {
        console.warn('No OPENSHIFT_NODEJS_IP environment variable');
        self.ipaddr = "0.0.0.0";
    }

    var allowCrossDomain = function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        //disable caching
        res.setHeader('Cache-Control', 'no-cache');
        next();
    };

    self.app = express();



//define usages
    self.app.configure(function() {
        self.app.use('/', express.static(__dirname + '/www'));
        self.app.use(express.bodyParser({
            keepExtensions: true
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
        reports.setup(self.dbConnect, self.uploadDir);
    });



    //define routes
    self.app.get('/', function(req, res) {
        console.log('Displaying options');
        res.status(200);
        res.send('<h1>preports - service</h1>' +
                '<h3>API</h3>'+
                '<p><a href="/reports">GET /reports</a></p>' +
                '<p>To retrieve reports in json use accept application/hal+json or application/json</p>'+
                '<h3>APP</h3>'+
                '<p>This is the preports service. The app has moved to another URL:</p>'+
                // '<h2>Frontend</2h>'+
                '<p><a href="http://preports-reifschneider.paas.pironet-ndh.com">preports app</a></p>'
                );
        res.end();
    });

//Reports CRUD API
    self.app.get('/reports', reports.getAll);
    self.app.get('/reports/names', reports.getProjectNames);
    self.app.get('/reports/count', reports.getReportsCount);
    self.app.get('/reports/:id', reports.getById);
    self.app.get('/reports/:id/images', reports.getReportImages);
    self.app.post('/reports', reports.createReport);
    self.app.put('/reports/:id', reports.updateReport);
    self.app.post('/reports/:id/images', reports.uploadImage);
    self.app.get('/reports/:id/images/:imgId', reports.getImage);
    self.app.delete('/reports/:id/images/:imgId', reports.deleteImage);
    self.app.delete('/reports/:id', reports.deleteReport);
    self.app.get('/crucible/:id', crucible.getCrucible);

//starting the nodejs server with express
    self.startServer = function() {
        self.server = http.createServer(self.app);

        // self.server.listen.apply(server, arguments);

        self.server.listen(self.port, self.ipaddr, function() {
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
