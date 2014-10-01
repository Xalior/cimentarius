'use strict';

var config = require('../../config/config'),
    Page = require('../../models/shelves/page').Page;

var page = {
    router: function(requestPath, req, res) {
        if(requestPath[0]==undefined) {
            requestPath[0]='index';
        }

        if(requestPath[0]);

        if (typeof(page.routes[requestPath])=='function') {
            page.routes[requestPath](requestPath, req, res)
        } else {
            res.renderAdmin('forms/page.swig');
        }
    },

    routes: {
        index: function(requestPath, req, res) {
            res.renderAdmin('edit.swig');
        }
    }
}

module.exports = page;
