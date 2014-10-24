'use strict';

var config = require('../../../config/config'),
    Promise = require('bluebird');

var CimentariusBookshelf = require('../../../models/shelves/cimentarius'),
    Site = require('../../../models/shelves/site').model,
    Sites = require('../../../models/shelves/site').collection,
    Page = require('../../../models/shelves/page').model,
    User = require('../../../models/shelves/admin/user').User;

var sitemap = {
    sitemap: function (requestPath, req, res) {
        new Site().fetchAll().then(function (sites) {
            return sites.mapThen(function (site) {
                var _site = {
                    title: site.get('title'),
                    domain: site.get('primary_domain'),
                    pages: []
                };
                var _parent = '';
                var walkPage = function(page, _parent) {
                    var _page = {
                        id: page.id,
                        title: page.get('title'),
                        slug: _parent + page.get('slug') + ('/'),
                        parent_id: page.get('parent_id'),
                        position: page.get('position')
                    };
                    return new Page().where({'parent_type': 'page', 'parent_id': page.id}).fetchAll()
                        .then(function (pages) {
                            if(pages.length > 0) {
                                return pages.mapThen(function (page) {
                                    console.log("with slug!"+_page.slug);
                                    return walkPage(page, _page.slug);
                                });
                            } else {
                                return null;
                            }
                        }).then(function(_pages) {
                            _page.pages = _pages;
                            return _page;
                        }
                    );
                };
                return new Page().where({'parent_type': 'site', 'parent_id': site.id}).fetchAll()
                    .then(function (pages) {
                        return pages.mapThen(function(page) {
                            return walkPage(page, _parent);
                        })
                        .then(function(_pages) {
                            _site.pages = _pages;
                            return _site;
                        });
                    }).then(function(_site) {
                        return _site;
                    }
                );
            }).then(function(_site) {
                return _site;
            });
        }).then(function (_sitemap) {
            res.end(JSON.stringify(_sitemap));
        });
    }
};

module.exports = sitemap;