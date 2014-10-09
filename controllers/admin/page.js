'use strict';

var config = require('../../config/config'),
    _ = require('lodash'),
    path = require('path'),
    Promise = require('bluebird'),
    fs = require("fs"),
    readdir = Promise.promisify(fs.readdir),
    staticserve = require('node-static'),
    Page = require('../../models/shelves/page').Page,
    Site = require('../../models/shelves/site').Site;

// Permitted parent object types
var permittedParents = ['page', 'site'];

var getTemplatesFor = function(templatePack, type) {
    var _pageTemplates = [];
    var _templatePath = path.resolve(__dirname + '../../../views/public/'+templatePack+'/'+type);
    return readdir(_templatePath).then(function(files) {
        for (var i = 0; i < files.length; i++) {
            if(path.extname(files[i])=='.swig') {
                var file = path.basename(files[i], '.swig');
                _pageTemplates.push({
                    name: file,
                    item: '  <div class="template-title"><strong>Template Name: </strong> <small>'+file+'</small>.</div>' +
                          '  <div class="template-preview"><img src="/'+config.admin+'/page/thumbnail/default/'+file+'"></div><br />'
                });
            }
        }
        _pageTemplates.push({
            name: ''
        });
        _pageTemplates.push({
            name: 'System Defined Default',
            item: '<div>System Defined Default</div>'
        });
        return _pageTemplates;
    });
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
            return page.routes['edit'](_pageRoute, req, res);
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
                                getTemplatesFor(thisSite.preference('template_pack'),'page').then(function (_pageTemplates) {
                                    res.locals.pageTemplates = JSON.stringify(_pageTemplates);
                                    var _newPage = {};
                                    var _position = requestPath.shift();
                                    if (_position == 'position') {
                                        _position = requestPath.shift();
                                        if (_position != parseInt(_position)) {
                                            _position = 65535;
                                        }
                                    }
                                    if (req.method.toUpperCase() == 'POST') {
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
                                            position: _position,
                                            templateName: 'System Defined Default'
                                        };
                                    }
                                    return res.renderAdmin('forms/page.swig', {page: JSON.stringify(_newPage.attributes)});
                                });
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
        } else if (typeof(page.routes[_pageRoute])=='function') {
            return page.routes[_pageRoute](requestPath, req, res);
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
                    return findSite(page).then(function(thisSite) {
                        return getTemplatesFor(thisSite.preference('template_pack'), 'page').then(function (_pageTemplates) {
                            res.locals.pageTemplates = JSON.stringify(_pageTemplates);
                            if (req.method.toUpperCase() == 'POST') {
                                if (req.body.created_at) delete(req.body.created_at);
                                page.attributes = req.body;
                                return page.validate().then(function (messages) {
                                    if (messages.errors)
                                        return res.end(JSON.stringify({errors: messages}));
                                    else
                                        page.save().then(function (data) {
                                            return res.end(JSON.stringify(data));
                                        });
                                });
                            }
                            console.log(page.attributes);
                            return res.renderAdmin('forms/page.swig', {page: JSON.stringify(page.attributes)});
                        });
                    });
                } else {
                    return res.errorAdmin(404, 'Page not found');
                }
            });
        },
        thumbnail: function(requestPath, req, res) {
            var _templatePack = requestPath.shift();
            var _templateName = requestPath.shift();

            var _templatePath = path.resolve(__dirname + '../../../views/public/'+_templatePack+'/page/'+_templateName+'.png');
            console.log(_templatePath);
            console.log(fs.existsSync(_templatePath));
            if(fs.existsSync(_templatePath)) {
                return new staticserve.Server(path.resolve(__dirname + '../../../views/public/'+_templatePack+'/page')).serveFile('/'+_templateName+'.png', 200, {}, req, res);
            } else {
                return res.errorAdmin(404, "Template pack thumbnail not found: <code>"+_templatePack+'\\'+_templateName+'</code>.');
            }
        }
    }
};

module.exports = page;
