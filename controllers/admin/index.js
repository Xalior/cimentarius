/**
 * Created by darran on 06/09/14.
 */
'use strict';
var config = require('./../../config/config'),
    User = require('./../../models/shelves/admin/user').User;

var admin = {
    auth: require('./auth'),
    routes: {
        auth: function(requestPath, req, res) {
            admin.auth.router(requestPath, req, res);
        },
        dashboard: function(requestPath, req, res) {
            require('./dashboard').router(requestPath, req, res);
        },
        api: function(requestPath, req, res) {
            require('./api/index').router(requestPath, req, res);
        },
        test: function(requestPath, req, res) {
            console.log('admin test:');
            console.log(requestPath);
        }
    },

    app: function(requestPath, req, res)  {
        console.info('cimentarius.admin.app:');
        admin.auth.passport.authenticate('admin-login');
        admin.router(requestPath, req, res);
    },

    router: function(requestPath, req, res) {
        console.info('cimentarius.admin.router: '+JSON.stringify(requestPath));

        var redirectPrefix = req.url.startsWith('/' +config.admin) ? '/'+ config.admin + '/' : '/';


        var route = requestPath.shift();
        if((route=='auth') || (req.isAuthenticated())) {
            if(!route) { route='dashboard'; }
            if (typeof(admin.routes[route])=='function') {
                admin.routes[route](requestPath, req, res)
            } else {
                res.end('Path is '+route+'+'+JSON.stringify(requestPath)+' and I should render taht now...');
            }
        } else {
            console.log('was asking for '+req.url);
            req.session.goingTo = req.url;
            req.flash('info', 'This page requires you to be logged in...');
            res.redirect(redirectPrefix + 'auth/login');
        }
    }
};

module.exports = admin;