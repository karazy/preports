var http = require('http');
var express = require('express');
var session = require('express-session');
var reports = require('./routes/reports');
var notifications = require('./routes/notifications');
var logout = require('./routes/logout/logout.controller');
var auth = require('./auth/authstrategy');
var passport = require('./config/passport');
var config = require('./config/environment');
var cookieParser = require('cookie-parser');
var mongo = require('./database/mongo');


var App = function() {

    // Scope
    var self = this;

    // Setup

    self.dbHost = process.env.MONGODB_DB_HOST || process.env.MONGOLAB_URI || "localhost";
    self.dbPort = 27017;
    self.uploadDir = process.env.UPLOAD_DIR;

    //Check if a port (from Heroku) is set and use it!
    if(process.env.PORT) {
        config.port = process.env.PORT;
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

    //Be sure to stick to the initialization order!
    //Otherwise problems are likely.
    self.app.use('/', express.static(__dirname + '/dist'));
    self.app.use(express.bodyParser({
        keepExtensions: true
    }));
    self.app.set('views', config.root + '/server/views');
    self.app.engine('html', require('ejs').renderFile);
    self.app.set('view engine', 'html');
    self.app.use(express.methodOverride());
    self.app.use(cookieParser());
    self.app.use(allowCrossDomain);  

    //use express session management. Needed for passport to work.
    self.app.use(session(
        { secret: 'keyboard cat', resave: true, saveUninitialized: true }
    ));    

    //setup passport (see config/pasport.js)
    passport.initialize(self.app);

    self.app.use(self.app.router);

    //Mongolab connection when deployed on Heroku
    if(typeof process.env.MONGOLAB_URI !== "undefined") {
        console.log("Connecting to mongolab");
        self.dbConnect = process.env.MONGOLAB_URI;
    } else {
        self.dbConnect = "mongodb://" + self.dbHost + ":" + self.dbPort + "/preports";
    }

    //Create mongodb connection
    mongo.connect(self.dbConnect);
    reports.setup(self.uploadDir);

    //define routes
    self.app.get('/login', auth.casAuth, function(req, res) {
        console.log("route '/login' called ");
    });

    //FIXME supported only with express 4.x
    //self.app.use('/api/logout', require('./routes/logout'));
    self.app.get('/logout', auth.logOut, logout.index);


    //Reports CRUD API
    self.app.get('/reports', auth.ensureAuthenticated, reports.getAll);
    self.app.get('/reports/names', auth.ensureAuthenticated, reports.getProjectNames);
    self.app.get('/reports/count', auth.ensureAuthenticated, reports.getReportsCount);
    self.app.get('/reports/:id', auth.ensureAuthenticated, reports.getById);
    self.app.get('/reports/:id/version', auth.ensureAuthenticated, reports.getReportVersion);
    self.app.get('/reports/:id/images', auth.ensureAuthenticated, reports.getReportImages);
    self.app.post('/reports', auth.ensureAuthenticated, reports.createReport);
    self.app.put('/reports/:id', auth.ensureAuthenticated, reports.updateReport);
    self.app.post('/reports/:id/images', auth.ensureAuthenticated, reports.uploadImage);
    self.app.get('/reports/:id/images/:imgId', auth.ensureAuthenticated, reports.getImage);
    self.app.delete('/reports/:id/images/:imgId', auth.ensureAuthenticated, reports.deleteImage);
    self.app.delete('/reports/:id', auth.ensureAuthenticated, reports.deleteReport);
    self.app.post('/reports/:id/notifications', auth.ensureAuthenticated, notifications.sendNotifications);

    //starting the nodejs server with express
    self.startServer = function() {
        self.server = http.createServer(self.app);

        self.server.listen(config.port, config.ip, function() {
            console.log('%s: Node server started on %s:%d ...', Date(Date.now()), config.ip, config.port);
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

    //needed for testing with supertest
    exports.app = self.app;
};

//create the app
var app = new App();

app.startServer();


