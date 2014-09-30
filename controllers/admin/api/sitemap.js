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
                console.log("Walking SITE: " + site.get('title'));
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
                    console.log('walkPage: '+page.get('title'));
                    return new Page().where({'parent_type': 'page', 'parent_id': page.id}).fetchAll()
                        .then(function (pages) {
                            if(pages.length > 0) {
                                return pages.mapThen(function (page) {
                                    console.log(' ready to walkPage: ' + page.get('title'));
                                    return walkPage(page);
                                });
                            } else {
                                return null;
                            }
                        }).then(function(_pages) {
                            _page.pages = _pages;
                            console.log('ready to return _pages');
                            return _page;
                        }
                    );
                };
                return new Page().where({'parent_type': 'site', 'parent_id': site.id}).fetchAll()
                    .then(function (pages) {
                        console.log('ready to mine');
                        return pages.mapThen(function(page) {
                            return walkPage(page);
                        })
                        .then(function(_pages) {
                            _site.pages = _pages;
                            return _site;
                        });
                    }).then(function(_site) {
                        console.log('site page fetch returning...');
                        console.log(_site);
                        return _site;
                    }
                );
            }).then(function(_site) {
                return _site;
            });
        }).then(function (_sitemap) {
            console.log(_sitemap);
            console.log("end of request");
            res.end(JSON.stringify(_sitemap));
        });
    }
};

module.exports = sitemap;