'use strict';

var config = require('../../config/config'),
    Page = require('../../models/shelves/page').Page;

var page = {
    router: function(requestPath, req, res) {
        if(requestPath[0]==undefined) {
            requestPath[0]='index';
        }

        var _pageId = parseInt(requestPath[0]);

        if (typeof(page.routes[requestPath])=='function') {
            page.routes[requestPath](requestPath, req, res)
        } else {
            if(_pageId) {
                page.routes['edit'](_pageId, req, res);
            }
        }
    },

    routes: {
        index: function(requestPath, req, res) {
            res.renderAdmin('pages.swig');
        },
        edit: function(pageId, req, res) {
            var page;
            if(pageId === parseInt(pageId)) {
                // get the page to be edited...
                Page.forge({id: pageId}).fetch().then(function(page) {
                    if(page) {
                        if(req.method.toUpperCase()=='POST') {
                            if(req.body.created_at) delete(req.body.created_at);
                            page.attributes = req.body;
                            return page.validate().then(function(messages) {
                                if(messages.errors)
                                    return res.end(JSON.stringify({errors: messages}));
                                else
                                    page.save().then(function(data) {
                                        return res.end(JSON.stringify(data));
                                    });
                            });
                        }
                        res.renderAdmin('forms/page.swig', {page: JSON.stringify(page.attributes)});
                    } else {
                        res.errorAdmin(404, 'Page not found');
                    }

                });
            }
        }
    }
};

module.exports = page;
