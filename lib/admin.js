/**
 * Created by darran on 06/09/14.
 */
'use strict';
var config = require('./config.js'),
    passport = require('passport'),
    User = require('../models/shelves/admin/user').User;

var admin = {
    auth: require('./auth'),
    app: function(requestPath, req, res)  {
        console.info('cimentarius.admin.app');
        passport.authenticate('local');
        admin.router(requestPath, req, res);
    },

    router: function(requestPath, req, res) {
        console.info('cimentarius.admin.router: '+JSON.stringify(requestPath));
        console.log("req.isAuthenticated: "+req.isAuthenticated());

        var redirectPrefix = req.url.startsWith('/' +config.admin) ? '/'+ config.admin + '/' : '/';

        if((requestPath[0]=='login') || (req.isAuthenticated())) {
            if(req.locals.goingTo)
                console.log("then going to "+req.locals.goingTo);
            res.end(JSON.stringify(requestPath));
        } else {
            console.log('was asking for '+req.url);
            console.log(req.session);
            req.locals.goingTo = req.url;
//                req.flash('message', 'This page requires you to be logged in...');
            res.redirect(redirectPrefix + 'login');
            return;

        }
    }
};

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

// Passport
passport.use(admin.auth.localStrategy());


module.exports = admin;