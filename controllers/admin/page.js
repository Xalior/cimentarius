'use strict';

var config = require('../../config/config'),
    _ = require('lodash'),
    path = require('path'),
    Promise = require('bluebird'),
    fs = Promise.promisifyAll(require("fs")),
    Page = require('../../models/shelves/page').Page,
    Site = require('../../models/shelves/site').Site;

// Permitted parent object types
var permittedParents = ['page', 'site'];

var getTemplatesFor = function(templatePack, type) {
    var _pageTemplates = [];
    var _templatePath = path.resolve(__dirname + '../../../views/public/'+templatePack+'/'+type);
    var foo = fs.readdir(_templatePath);
    console.log(foo);
    console.log('done');
    //.then(function(files) {
//        console.log(files);
        //files.map(function (file) {
        //    fs.readFile(file, 'utf-8', function (err, contents) {
        //        _pageTemplates.push({
        //            name: file
        //        })
        //    });
        //}).then(function (files) {
        //    console.log(_pageTemplates);
        //});
        //files.filter(function(file) {
        //    return file.substr(-5) === '.swig';
        //})
        //}
//    });
};

var findSite = function(page) {
    switch (page.get('parent_type')) {
        // genericise this to use the permitted parents array
        case('page'):
            return new Page().where({id: page.get('parent_id')}).fetch().then(function (_parentShelf) {
                return findSite(_parentShelf);
            });
        case('site'):
            return new Site().where({id: page.get('parent_id')}).fetch().then(function (_mySite) {
                return _mySite;
            });
        default:
            console.log('default switch in findSite');
    }
};

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
                var _parentId = requestPath.shift();
                if(_parentId == parseInt(_parentId)) {
                    // we should handle objects other than Page, to match above array...
                    return Page.forge({id: _parentId}).fetch().then(function(_parentShelf) {
                        if(_parentShelf) {
                            findSite(_parentShelf).then(function(thisSite) {
                                res.locals.pageTemplates = getTemplatesFor(thisSite.preference('template_pack'),'page');
                                console.log(res.locals.pageTemplates);
                                var _newPage = {};
                                var _position = requestPath.shift();
                                if(_position == 'position') {
                                    _position = requestPath.shift();
                                    if(_position != parseInt(_position)) {
                                        _position = 65535;
                                    }
                                }
                                if(req.method.toUpperCase()=='POST') {
                                    // SAVE IT
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
                                    // a new, not a save -- sub from URL, to pass to ng-api
                                    _newPage.attributes = {
                                        parent_type: _pageParent,
                                        parent_id: _parentId,
                                        position: _position
                                    };
                                }
                                return res.renderAdmin('forms/page.swig', {page: JSON.stringify(_newPage.attributes)});
                            });

                        } else {
                            return res.errorAdmin(404, 'Page not found');
                        }
                    });
                } else {
                    return res.errorAdmin(404, 'Parent '+_pageParent+' not Found');
                }
                return res.errorAdmin(418, "<p>You're seeing this, well, probably because something unexpected happened...</p><p>Also, I am <strong>not</strong> a tea pot.</p>");
            } else {
                return res.errorAdmin(404, 'Parent Type not Found');
            }
        } else if (typeof(page.routes[_pageId])=='function') {
            return page.routes[_pageId](requestPath, req, res);
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
