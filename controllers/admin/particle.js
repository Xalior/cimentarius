'use strict';

var config = require('../../config/config'),
    _ = require('lodash'),
    path = require('path'),
    Promise = require('bluebird'),
    fs = require("fs"),
    staticserve = require('node-static'),
    Particle = require('../../models/shelves/particle').Particle,
    Site = require('../../models/shelves/site').Site,
    TemplateHelper = require('../../lib/helpers/template'),
    ContentHelper = require('../../lib/helpers/content');

var particle = {
    router: function(requestPath, req, res) {
        var _particleRoute = requestPath.shift();

        if(_particleRoute==undefined) {
            return res.errorAdmin(404, "Basic Particle not found: <code>"+_particleRoute+'</code>.');
        }

        if(_particleRoute == parseInt(_particleRoute)) {
            return particle.routes['edit'](_particleRoute, req, res);
        } else if(_particleRoute=='NEW') {
            if(requestPath.length<4) return res.errorAdmin(404, "Not Enough Information To Create New Particle: <code>"+requestPath.length+'&lt;4</code>.');
            var _parentType = requestPath.shift();
            var _parentId = requestPath.shift();
            var _particleModule = requestPath.shift();
            var _particleType = requestPath.shift();
            console.log(_parentType,_parentId,_particleModule,_particleType)

            //if(_.contains(permittedParents,_particleParent)) {
            //    var _parentId = requestPath.shift();
            //    if(_parentId == parseInt(_parentId)) {
            //        // we should handle objects other than Page, to match above array...
            //        return Page.forge({id: _parentId}).fetch().then(function(_parentShelf) {
            //            if(_parentShelf) {
            //                findSite(_parentShelf).then(function(thisSite) {
            //                    var _defaultTemplatePack = thisSite.getPreference('template_pack');
            //                    getTemplatesFor(thisSite.getPreference('template_pack')).then(function (_pageTemplates) {
            //                        res.locals.pageTemplates = JSON.stringify(_pageTemplates);
            //                        var _newParticle = {};
            //                        var _position = requestPath.shift();
            //                        if (_position == 'position') {
            //                            _position = requestPath.shift();
            //                            if (_position != parseInt(_position)) {
            //                                _position = 65535;
            //                            }
            //                        }
            //                        if (req.method.toUpperCase() == 'POST') {
            //                            // SAVE IT
            //                            _newParticle = new Page;
            //                            _newParticle.attributes = req.body;
            //
            //                            if (_newParticle.attributes.created_at) delete(_newParticle.attributes.created_at);
            //                            if (_newParticle.attributes.template) delete(_newParticle.attributes.template);
            //
            //                            return _newParticle.validate().then(function (messages) {
            //                                if (messages.errors)
            //                                    return res.end(JSON.stringify({errors: messages}));
            //                                else {
            //                                    _newParticle.save().then(function (data) {
            //                                        var data = data.attributes;
            //                                        var _template = data.templateName;
            //                                        // fix default template
            //                                        if (_template=="System Defined Default") _template = thisSite.getPreference('default_page_template');
            //                                        data.template = TemplateHelper.parseTemplate(TemplateHelper.getTemplatePath(_defaultTemplatePack, 'page') + '/' + _template + '.swig');
            //                                        return res.end(JSON.stringify(data));
            //                                    });
            //                                }
            //                            });
            //                        } else {
            //                            // a new, not a save -- sub from URL, to pass to ng-api
            //                            _newParticle.attributes = {
            //                                parent_type: _particleParent,
            //                                parent_id: _parentId,
            //                                position: _position,
            //                                templateName: 'System Defined Default'
            //                            };
            //                        }
            //                        return res.renderAdmin('forms/page.swig', {page: JSON.stringify(_newParticle.attributes)});
            //                    });
            //                });
            //
            //            } else {
            //                return res.errorAdmin(404, 'Page not found');
            //            }
            //        });
            //    } else {
            //        return res.errorAdmin(404, 'Parent '+_particleParent+' not Found');
            //    }
            //    return res.errorAdmin(418, "<p>You're seeing this, well, probably because something unexpected happened...</p><p>Also, I am <strong>not</strong> a tea pot.</p>");
            //} else {
            //    return res.errorAdmin(404, 'Parent Type not Found');
            //}
        } else if (typeof(particle.routes[_particleRoute])=='function') {
            return particle.routes[_particleRoute](requestPath, req, res);
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
                        var _defaultTemplatePack = thisSite.getPreference('template_pack');
                        return getTemplatesFor(_defaultTemplatePack, 'page').then(function (_pageTemplates) {
                            res.locals.pageTemplates = JSON.stringify(_pageTemplates);
                            if (req.method.toUpperCase() == 'POST') {
                                page.attributes = req.body;

                                return page.validate().then(function (messages) {
                                    if (messages.errors)
                                        return res.end(JSON.stringify({errors: messages}));
                                    else
                                        page.save().then(function (data) {
                                            var data = data.attributes;
                                            var _template = data.templateName;
                                            // fix default template
                                            if (_template=="System Defined Default") _template = thisSite.getPreference('default_page_template');
                                            data.template = TemplateHelper.parseTemplate(TemplateHelper.getTemplatePath(_defaultTemplatePack, 'page') + '/' + _template + '.swig');
                                            return res.end(JSON.stringify(data));
                                        });
                                });
                            } else {
                                var data = page.attributes;
                                var _template = data.templateName;
                                // fix default template
                                if (_template == "System Defined Default") _template = thisSite.getPreference('default_page_template');
                                data.template = TemplateHelper.parseTemplate(TemplateHelper.getTemplatePath(_defaultTemplatePack, 'page') + '/' + _template + '.swig');
                                return res.renderAdmin('forms/page.swig', {page: JSON.stringify(data)});
                            }
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
            if(fs.existsSync(_templatePath)) {
                return new staticserve.Server(path.resolve(__dirname + '../../../views/public/'+_templatePack+'/page')).serveFile('/'+_templateName+'.png', 200, {}, req, res);
            } else {
                return res.errorAdmin(404, "Template pack thumbnail not found: <code>"+_templatePack+'\\'+_templateName+'</code>.');
            }
        }
    }
};

module.exports = particle;
