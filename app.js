var http = require('http');
var express = require('express');
var session = require('express-session');
var reports = require('./routes/reports');
var logout = require('./routes/logout/logout.controller');
var crucible = require('./routes/crucible');
var auth = require('./auth/authstrategy');
var passport = require('./config/passport');
var config = require('./config/environment');

//Skip validation if DISABLE_CAS == true
if(process.env.DISABLE_CAS == "true") {
    console.log('Found DISABLE_CAS = true. Disabled CAS authentication! Don\'t use for production.');
    config.authentication.disabled = true;
}




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
        //Be sure to stick to the initialization order!
        //Otherwise problems are likely.
        self.app.use('/', express.static(__dirname + '/www'));
        self.app.use(express.bodyParser({
            keepExtensions: true
        }));
        self.app.use(express.methodOverride());
        self.app.use(allowCrossDomain);  

        //use express session management. Needed for passport to work.
        self.app.use(session(
            { secret: 'keyboard cat', resave: true, saveUninitialized: true }
        ));    

        //setup passport (see config/pasport.js)
        passport.initialize(self.app);

        self.app.use(self.app.router);


        if (typeof process.env.OPENSHIFT_MONGODB_DB_USERNAME === "undefined") {
            self.dbConnect = "mongodb://" + self.dbHost + ":" + self.dbPort + "/preports";
        } else {
            console.log("mongo logon with user: " + process.env.OPENSHIFT_MONGODB_DB_USERNAME);
            self.dbConnect = "mongodb://" + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":"
                    + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@"
                    + self.dbHost + ":" + self.dbPort + "/preports";
        }
        reports.setup(self.dbConnect, self.uploadDir);
    });



    //define routes
    self.app.get('/login', auth.casAuth, function(req, res) {
        console.log("route '/login' called ");
    });

    //FIXME supported only with express 4.x
    //self.app.use('/api/logout', require('./routes/logout'));
    self.app.get('/logout', auth.logOut, logout.index);

    self.app.get('/', function(req, res) {
        console.log('Displaying options');
        res.status(200);
        res.send('<h1>preports - service</h1>' +
                '<h3>API</h3>'+
                '<p><a href="/reports">GET /reports</a></p>' +
                '<p>To retrieve reports in json use accept application/hal+json or application/json</p>'
                );
        res.end();
    });


    //Reports CRUD API
    self.app.get('/reports', auth.ensureAuthenticated, reports.getAll);
    self.app.get('/reports/names', auth.ensureAuthenticated, reports.getProjectNames);
    self.app.get('/reports/count', auth.ensureAuthenticated, reports.getReportsCount);
    self.app.get('/reports/:id', auth.ensureAuthenticated, reports.getById);
    self.app.get('/reports/:id/images', auth.ensureAuthenticated, reports.getReportImages);
    self.app.post('/reports', auth.ensureAuthenticated, reports.createReport);
    self.app.put('/reports/:id', auth.ensureAuthenticated, reports.updateReport);
    self.app.post('/reports/:id/images', auth.ensureAuthenticated, reports.uploadImage);
    self.app.get('/reports/:id/images/:imgId', auth.ensureAuthenticated, reports.getImage);
    self.app.delete('/reports/:id/images/:imgId', auth.ensureAuthenticated, reports.deleteImage);
    self.app.delete('/reports/:id', auth.ensureAuthenticated, reports.deleteReport);

    self.app.get('/crucible/:id', auth.ensureAuthenticated, crucible.getCrucible);

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

//create the app
var app = new App();

//call the connectDb function and pass in the start server command
app.startServer();
