'use strict';

var config = require('../../config/config'),
    _ = require('lodash'),
    Page = require('../../models/shelves/page').Page,
    Site = require('../../models/shelves/site').Site;

// Permitted parent object types
var permittedParents = ['page'];

var page = {
    router: function(requestPath, req, res) {

        var _pageRoute = requestPath.shift();
        if(_pageRoute==undefined) {
            _pageRoute='index';
        }


        if(_pageRoute == parseInt(_pageRoute)) {
            page.routes['edit'](_pageRoute, req, res);
            return;
        } else if(_pageRoute=='NEW') {
            // check our parent type exists. Either site, or page.
            var _pageParent = requestPath.shift();
            if(_.contains(permittedParents,_pageParent)) {
                console.log("NEW under a "+_pageParent);
                var _parentId = requestPath.shift();
                if(_parentId == parseInt(_parentId)) {
                    return Page.forge({id: _parentId}).fetch().then(function(_parentShelf) {
                        if(_parentShelf) {
                            var _newPage = {};
                            var _position = requestPath.shift();
                            if(_position == 'position') {
                                _position = requestPath.shift();
                                if(_position != parseInt(_position)) {
                                    _position = 65535;
                                }
                            }
                            if(req.method.toUpperCase()=='POST') {
                                _newPage = new Page;
                                _newPage.attributes = req.body;
                                return _newPage.validate().then(function (messages) {
                                    if (messages.errors)
                                        return res.end(JSON.stringify({errors: messages}));
                                    else {
                                        _newPage.save().then(function (data) {
                                            return res.end(JSON.stringify(data));
                                        });
                                    }
                                });
                            } else {
                                _newPage.attributes = {
                                    parent_type: _pageParent,
                                    parent_id: _parentId,
                                    position: _position
                                };
                            }
                            return res.renderAdmin('forms/page.swig', {page: JSON.stringify(_newPage.attributes)});
                        } else {
                            return res.errorAdmin(404, 'Page not found');
                        }
                    });
                } else {
                    return res.errorAdmin(404, 'Parent '+_pageParent+' not Found');
                }
                res.errorAdmin(418, "You're seeing this, becauise D's not written the new under parent page yet... So, have some tea. I am not a tea pot.");
            } else {
                res.errorAdmin(404, 'Parent Type not Found');
                return;
            }
        } else if (typeof(page.routes[_pageId])=='function') {
            page.routes[_pageId](requestPath, req, res);
            return;
        }
    },

    routes: {
        index: function(requestPath, req, res) {
            res.renderAdmin('pages.swig');
        },
        edit: function(pageId, req, res) {
            // get the page to be edited...
            return Page.forge({id: pageId}).fetch().then(function(page) {
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
};

module.exports = page;
