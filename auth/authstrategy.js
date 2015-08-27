'use strict';

var config = require('../config/environment');
var passport = require('passport');
var logger = require('../components/logger');

module.exports = function() {

    var myret = {};

    /**
     * Middleware that check if user is autenticated and redirects him to a corect route (login if not autenticated, next(requested route) if autenticated)
     
     */
    myret.ensureAuthenticated = function(req, res, next) {
            if(config.authentication.disabled) {
                console.log('Skip authentication request!');
                next();
                return;
            }
            if (req.isAuthenticated()) {
                var user = req.session.passport.user;
                console.log("Authenticated", user.user);
 
                return next();
            }
            console.log("User not authenticated.");

           var authResult = passport.authenticate('cas')(req, res, next);
           console.log('AUTH ' + authResult);


           return res.status(401).send();
        }
    
    /**
     * Autentification middleware. If the user is not autenticated (see ensureAuthenticated middleware) it gets redirected to /login route. Login route uses this middleware to redirect to cas for autentication.
     * @param  {[type]}   req  [description]
     * @param  {[type]}   res  [description]
     * @param  {Function} next [description]
     * @return {[type]}        [description]
     */
    myret.casAuth = function(req, res, next) {

        console.log('authstrategy: starting cas authentication');
        passport.authenticate('cas', function(err, data, info) {
            console.log('authstrategy: cas callback');
            if (err) {
                console.log(err, " Cas auth error")
                return next(err);
            }
            if (!data) {
                console.log(" Cas auth error not enogh data. Message: " + info.message)
                return res.render('/error');
            }
            req.login(data, function(err) {
                if (err) {
                    return next(err);
                }

                if(!req.session) {
                    req.session = {};
                }
                
                req.session.user = data.user;
                console.log("Cas login successfull for user " + data.user + ". redirecting to /")
                return res.redirect('/');
            });
        })(req, res, next);
    }

    myret.logOut = function(req, res, next) {
        console.log('authstrategy: logout called');
        req.logOut();
        res.set('Access-Control-Allow-Origin', '*');
        res.redirect(302, config.authentication.strategy.ssoBase + '/logout');

        //return res.status(200).send();
    }
    return myret;

}();