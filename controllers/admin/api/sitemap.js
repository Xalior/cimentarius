'use strict';

var config = require('../../../config/config'),
    Promise = require('bluebird');

var CimentariusBookshelf = require('../../../models/shelves/cimentarius'),
    Site = require('../../../models/shelves/site').Site,
    Sites = require('../../../models/shelves/site').Sites,
    Page = require('../../../models/shelves/page').Page,
    User = require('../../../models/shelves/admin/user').User;

// Knex Instance
var knex = CimentariusBookshelf.knex;

var sitemap = {
    sitemap: function (requestPath, req, res) {
        new Site().fetchAll().then(function (sites) {
            return sites.mapThen(function (site) {
                var _site = {
                    title: site.get('title'),
                    domain: site.get('primary_domain'),
                    pages: []
                };
                var walkPage = function(page) {
                    var _page = {
                        id: page.id,
                        title: page.get('title'),
                        slug: page.get('slug')
                    };
                    return new Page().where({'parent_type': 'page', 'parent_id': page.id}).fetchAll()
                        .then(function (pages) {
                            if(pages.length > 0) {
                                return pages.mapThen(function (page) {
                                    return walkPage(page);
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
                            return walkPage(page);
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