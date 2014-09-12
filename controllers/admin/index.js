/**
 * Created by darran on 06/09/14.
 */
'use strict';
var config = require('./../../config/config'),
    User = require('./../../models/shelves/admin/user').User;

var admin = {
    routes: {
        auth: require('./auth')
    },
    passport: require('passport'),
    app: function(requestPath, req, res)  {
        console.info('cimentarius.admin.app');
        admin.passport.authenticate('local');
        admin.router(requestPath, req, res);
    },

    router: function(requestPath, req, res) {
        console.info('cimentarius.admin.router: '+JSON.stringify(requestPath));
        console.log("req.isAuthenticated: "+req.isAuthenticated());

        var redirectPrefix = req.url.startsWith('/' +config.admin) ? '/'+ config.admin + '/' : '/';

        if((requestPath[0]=='auth') || (req.isAuthenticated())) {
            var route = requestPath.shift();
            if(route=='auth')
                admin.routes.auth.router(requestPath, req, res);
            // do this route.
            res.end('Path is '+JSON.stringify(requestPath)+' and I should render taht now...');
        } else {
            console.log('was asking for '+req.url);
            req.session.goingTo = req.url;
//            req.flash('message', 'This page requires you to be logged in...');
            res.redirect(redirectPrefix + 'auth/login');
        }
    }
};

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
admin.passport.serializeUser(function(user, done) {
    done(null, user.id);
});

admin.passport.deserializeUser(function(id, done) {
    findById(id, function (err, user) {
        done(err, user);
    });
});

// Passport
admin.passport.use(admin.routes.auth.localStrategy());


module.exports = admin;