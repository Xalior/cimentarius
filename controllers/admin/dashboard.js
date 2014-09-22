'use strict';

var config = require('../../config/config'),
    User = require('../../models/shelves/admin/user').User;

var dashboard = {
    router: function(requestPath, req, res) {
        console.log('dashboard router');
        if(requesPath[0]==undefined) {
            requestPath[0]='index';
        }

        if (typeof(dashboard.routes[requestPath])=='function') {
            dashboard.routes[requestPath](requestPath, req, res)
        } else {
            console.log(requestPath);
        }
    },

    routes: {
        index: function(requestPath, req, res) {
            res.renderAdmin('dashboard.swig');
        }
    }
}

module.exports = dashboard;
