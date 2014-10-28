'use strict';

var config = require('../../config/config'),
    _ = require('lodash'),
    path = require('path'),
    Promise = require('bluebird'),
    fs = require("fs"),
    staticserve = require('node-static'),
    Page = require('../../models/shelves/page').model,
    Site = require('../../models/shelves/site').model,
    TemplateHelper = require('../../lib/helpers/template'),
    ContentHelper = require('../../lib/helpers/content');

// Permitted parent object types
var permittedParents = ['page', 'site'];

var getTemplatesFor = function(templatePack) {
    return TemplateHelper.getTemplatesFor(templatePack,'page').then(function(files){
        var _pageTemplates = [];
        for (var i = 0; i < files.length; i++) {
            if(path.extname(files[i])=='.swig') {
                var file = path.basename(files[i], '.swig');
                _pageTemplates.push({
                    name: file,
                    item: '<div class="template-title"><strong>Template Name: </strong>' +
                          ' <small>'+file+'</small>.</div>' +
                          '<div class="template-preview"><img src="/'+config.admin+'/page/thumbnail/default/'+file+'"></div><br />'
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

var _page = {
    delete:  function(pageId, req, res) {
        // get the page to be edited...
        return Page.forge({id: pageId}).fetch().then( function (page) {
            if (page) {
                var oldId = page.id;
                return page.destroy().then(function(deadPage) {
                    console.log(typeof deadPage.id);
                    if(typeof deadPage.id == 'undefined') {
                        return res.end(JSON.stringify({deleted: oldId}));
                    }
                });
            } else {
                return res.errorAdmin(404, 'Page not found');
            }
        });
    },
    edit:  function(pageId, req, res) {
        // get the page to be edited...
        return Page.forge({id: pageId}).fetch().then( function (page) {
            if (page) {
                return _page.findSite(page, req, res).then(function () {
                    return getTemplatesFor(res.templatePack, 'page').then(function (_pageTemplates) {
                        res.locals.pageTemplates = JSON.stringify(_pageTemplates);
                        return _page.editModel(page, req, res);

                    });
                });
            } else {
                return res.errorAdmin(404, 'Page not found');
            }
        });
    },
    editModel: function(page, req, res) {
        if (req.method.toUpperCase() == 'POST') {
            page.set(req.body);

            return page.validate().then(function (messages) {
                if (messages.errors)
                    return res.end(JSON.stringify({errors: messages}));
                else
                    page.save().then(function (data) {
                        var data = data.toJSON({shallow:true});
                        return req.site.getPreference('default_page_template').then(function(_template){
                            // fix default template
                            if (data.templateName != "System Defined Default") {
                                _template = data.templateName;
                            } else {
                                console.log(_template);
                                _template = _template.value;
                            }
                            data.template = TemplateHelper.parseTemplate(TemplateHelper.getTemplatePath(res.templatePack, 'page') + '/' + _template + '.swig');
                            return res.end(JSON.stringify(data));
                        });
                    });
            });
        } else {
            var _template = page.get('templateName');
            return page.particles().then(function(particles) {

                var _particles = {};
                particles.forEach(function(_particle) {
                    var _thisParticleType = ContentHelper.getFilteredTypes(_particle.module+':'+_particle.get('type'));
                    console.log(_thisParticleType);
                    var _thisParticle = {
                        id: _particle.id,
                        type: _particle.get('type'),
                        title: _particle.get('title'),
                        position: _particle.get('position'),
                        className: _thisParticleType.className,
                        content_block: _particle.get('content_block')
                    };
                    if(typeof _particles[_thisParticle.content_block] != 'object') {
                        _particles[_thisParticle.content_block] = [];
                    }
                    _particles[_thisParticle.content_block].push(_thisParticle);
                });
                console.log(_particles);
//                page.attributes.particles = _particles;
                // fix default template
                return req.site.getPreference('default_page_template').then(function(default_page_template) {
                    if (_template == "System Defined Default") _template = default_page_template.value;
                    page.attributes.template = TemplateHelper.parseTemplate(TemplateHelper.getTemplatePath(res.templatePack, 'page') + '/' + _template + '.swig');
                    page.attributes.template.contentBlocks.forEach(function(contentBlock) {
                        if(_particles[contentBlock.name]) {
                            contentBlock.particles = _particles[contentBlock.name];
                            delete _particles[contentBlock.name];
                        } else {

                            contentBlock.particles = [];
                        }
                        console.log(page.attributes.template.contentBlocks);
                    });
                    return res.renderAdmin('layouts/master.swig', {content: page.form(res)});
                });
            });
        }
    },
    findSite: function(page, req, res) {
        return page.findSite().then(function(_site) {
            req.site = _site;

            return req.site.getPreference('template_pack').then(function(_templatePack) {
                res.templatePack = _templatePack;
                return;
            });
        });
    }
};

var page = {
    router: function(requestPath, req, res) {
        var _pageRoute = requestPath.shift();

        if(_pageRoute==undefined) {
            _pageRoute='index';
        }

        if(_pageRoute == parseInt(_pageRoute)) {
            return _page.edit(_pageRoute, req, res);
        } else if(_pageRoute=='NEW') {
            // check our parent type exists. Either site, or page.
            var _pageParent = requestPath.shift();
            if(_.contains(permittedParents,_pageParent)) {
                var _parentId = requestPath.shift();
                if(_parentId == parseInt(_parentId)) {
                    // we should handle objects other than Page, to match above array...
                    return Page.forge({id: _parentId}).fetch().then(function(_parentShelf) {
                        if(_parentShelf) {
                            return _page.findSite(_parentShelf, req, res).then(function() {
                                var _position = requestPath.shift();
                                if (_position == 'position') {
                                    _position = requestPath.shift();
                                    if (_position != parseInt(_position)) {
                                        _position = 65535;
                                    }
                                }
                                var _newPage = new Page;
                                _newPage.set({
                                    parent_type: _pageParent,
                                    parent_id: _parentId,
                                    position: _position,
                                    templateName: 'System Defined Default'
                                });
                                return getTemplatesFor(res.templatePack).then(function (_pageTemplates) {
                                    res.locals.pageTemplates = JSON.stringify(_pageTemplates);

                                    return _page.editModel(_newPage, req, res);
                                });
                            });
                        } else {
                            return res.errorAdmin(404, 'Page not found');
                        }
                    });
                } else {
                    return res.errorAdmin(404, 'Parent '+_pageParent+' not Found');
                }
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
        thumbnail: function(requestPath, req, res) {
            var _templatePack = requestPath.shift();
            var _templateName = requestPath.shift();

            var _templatePath = path.resolve(__dirname + '../../../views/public/'+_templatePack+'/page/'+_templateName+'.png');
            if(fs.existsSync(_templatePath)) {
                return new staticserve.Server(path.resolve(__dirname + '../../../views/public/'+_templatePack+'/page')).serveFile('/'+_templateName+'.png', 200, {}, req, res);
            } else {
                return res.errorAdmin(404, "Template pack thumbnail not found: <code>"+_templatePack+'\\'+_templateName+'</code>.');
            }
        },
        delete: function(requestPath, req, res) {
            if(requestPath.length==1) {
                var _pageRoute = requestPath[0];
                if(_pageRoute == parseInt(_pageRoute)) {
                    return _page.delete(_pageRoute, req, res);
                } else {
                    return res.errorAdmin(404, 'Page to delete path not understood.');
                }
            } else {
                return res.errorAdmin(404, 'Page to delete path not correct.');
            }
            var _pageId =
            console.log("ready to delete some shit");
            console.log(requestPath);
        }
    }
};

module.exports = page;
