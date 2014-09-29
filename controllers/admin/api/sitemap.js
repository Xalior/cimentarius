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
                console.log("Walking " + site.get('title'));
                var _site = {
                    title: site.get('title'),
                    domain: site.get('primary_domain'),
                    pages: []
                };
                var walkPage = function(page) {
                    console.log('page '+page.get('title'));
                    return new Page().where({'parent_type': 'page', 'parent_id': page.id}).fetchAll()
                        .then(function (pages) {
                            return pages.mapThen(function (page) {
                                return walkPage(page);
                            })
                                .then(function (_pages) {
                                    var sitePages = [];
                                    console.log(_pages.length);
                                    if(_pages.length>0) {
                                        for (var index = 0; index < _pages.length; ++index) {
                                            console.log(_pages[index]);
                                            var _sitePage = {
                                                is: _pages[index].id,
                                                title: _pages[index].get('title'),
                                                slug: _pages[index].get('slug')
                                            };
                                            sitePages.push(_sitePage);
                                        }
                                    }
                                    return sitePages;
                                });
                        }
                    );
                };
                return new Page().where({'parent_type': 'site', 'parent_id': site.id}).fetchAll()
                    .then(function (pages) {
                        return pages.mapThen(function(page) {
                            return walkPage(page);
                        })
                            .then(function(_pages) {
                                return _pages;
                            });
                    }
                );
            });
        }).then(function (_sitemap) {
            console.log(_sitemap);
            res.end(JSON.stringify(_sitemap));
        });
    }
};

module.exports = sitemap;