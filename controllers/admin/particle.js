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


var _particle = {
    edit:  function(particleId, req, res) {
        // get the page to be edited...
        return Particle.forge({id: paricleId}).fetch().then( function (particle) {
            if (particle) {
                return _particle.findSite(particle, req, res).then(function () {
                    return getTemplatesFor(res.templatePack, particle.get('type')).then(function (_particleTemplates) {
                        res.locals.particleTemplates = JSON.stringify(_particleTemplates);
                        return _particle.editModel(page, req, res);
                    });
                });
            } else {
                return res.errorAdmin(404, 'Particle not found');
            }
        });
    },
    editModel: function(particle, req, res) {
        if (req.method.toUpperCase() == 'POST') {
            particle.attributes = req.body;

            return particle.validate().then(function (messages) {
                if (messages.errors)
                    return res.end(JSON.stringify({errors: messages}));
                else
                    particle.save().then(function (data) {
                        var data = data.attributes;
                        var _template = data.templateName;
                        // fix default template
                        if (_template == "System Defined Default") _template = req.site.getPreference('default_particle_template');
                        data.template = TemplateHelper.parseTemplate(TemplateHelper.getTemplatePath(res.templatePack, 'page') + '/' + _template + '.swig');
                        return res.end(JSON.stringify(data));
                    });
            });
        } else {
            var data = particle.attributes;
            var _template = data.templateName;
            // fix default template
            if (_template == "System Defined Default") _template = req.site.getPreference('default_particle_template');
            data.template = TemplateHelper.parseTemplate(TemplateHelper.getTemplatePath(res.templatePack, 'page') + '/' + _template + '.swig');
            return res.renderAdmin('forms/page.swig', {page: JSON.stringify(data)});
        }
    },
    findSite: function(page, req, res) {
        switch (page.get('parent_type')) {
            // genericise this to use the permitted parents array
            case('page'):
                return new Page().where({id: page.get('parent_id')}).fetch().then(function (_parentShelf) {
                    return _particle.findSite(_parentShelf, req, res);
                });
            case('site'):
                return new Site().where({id: page.get('parent_id')}).fetch().then(function (thisSite) {
                    req.site = thisSite;
                    res.templatePack = req.site.getPreference('template_pack');
                    return;
                });
            default:
                console.log('default switch in findSite');
        }
    }
};

var particle = {
    router: function(requestPath, req, res) {
        var _particleRoute = requestPath.shift();

        if(_particleRoute==undefined) {
            return res.errorAdmin(404, "Basic Particle not found: <code>"+_particleRoute+'</code>.');
        }

        if(_particleRoute == parseInt(_particleRoute)) {
            return particle.routes['edit'](_particleRoute, req, res);
        } else if(_particleRoute=='NEW') {
            if(requestPath.length<5) return res.errorAdmin(404, "Not Enough Information To Create New Particle: <code>"+requestPath.length+'&lt;5</code>.');
            var _parentType = requestPath.shift();
            var _parentModule = '_builtin';
            var _parentId = requestPath.shift();
            var _blockName = requestPath.shift();
            var _particleModule = requestPath.shift();
            var _particleType = requestPath.shift();
            var contentType;

            if(_parentType.contains(':')) {
                var _typeParts = _parentType.split(':');
                _parentType = _typeParts[1];
                _parentModule = _typeParts[0];
            }
            console.log(_parentModule,_parentType,_parentId,_blockName,_particleModule,_particleType);

            var allContentTypes;
            for (var i in allContentTypes = ContentHelper.getAllTypes()) {
                if(_particleModule == i) {
                    if (allContentTypes[i].types[_particleType]) {
                        // validate requested parent Type...
                        var allParentTypes;
                        for (var i in allParentTypes = ContentHelper.getAllParentTypes()) {
                            if(_parentModule == i) {
                                if (allParentTypes[i].types[_parentType]) {
                                    var parent = new allParentTypes[i].types[_parentType].model.model();
                                    return parent.fetch({id:_parentId}).then(function(parent) {
                                        if(parent) {
                                            // Parent is found - let's start building our new article part.
                                            var particle = new allContentTypes[i].types[_particleType].model.Model();
                                            particle.set({
                                                parent_type: _parentType,
                                                parent_id: _parentId,
                                                content_block: _blockName
                                            });

                                            return _particle.editModel(particle, req, res);
                                        } else {
                                            return res.errorAdmin(404, "Specified Parent Not Found");
                                        }

                                    });
                                }
                            }

                        }
                        return res.errorAdmin(404, "Specified Parent Type Not Found");
                    }
                }
            }
            return res.errorAdmin(404, 'Specified Content Type Not Found');

            //if(parentType = _.find(_permittedParents, function(parent) {
            //    return((parent.type == _parentModule) && (parent.name == _parentType));
            //})) {
            //    console.log(parentType);
            //    return res.errorAdmin(404, "Ready to create a child: <code>"+_parentModule+'/'+_parentType+':'+_parentId+'</code>.');
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
