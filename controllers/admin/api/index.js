'use strict';

var config = require('../../../config/config');

var api = {
    router: function(requestPath, req, res) {
        console.log('api router');

        var route = requestPath.shift();
        if(route==undefined) { route='index'; }

        if (typeof(api.routes[route])=='function') {
            api.routes[route](requestPath, req, res)
        } else {
            console.log(requestPath);
        }
    },

    routes: {
        index: function(requestPath, req, res) {
            res.renderAdmin('api.swig');
        },
        sitemap: function(requestPath, req, res) {
            require('./sitemap.js').sitemap(requestPath, req, res);
        }
    }
}

module.exports = api;
