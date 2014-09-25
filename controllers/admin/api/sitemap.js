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
        var _sitemap = [];

        new Sites().fetch().then(function(sites) {
            var sitePromises = [];
            var sitePromise = function(site) {
                sitePromises.push(new Promise(function (resolve) {
                    var _site = {};
                    _site.title = site.get('title');
                    _site.domain = site.get('primary_domain');
                    _site.pages = [
                        {
                            "id": 1,
                            "title": "1. dragon-breath",
                            "pages": []
                        },
                        {
                            "id": 2,
                            "title": "2. moiré-vision",
                            "pages": [
                                {
                                    "id": 21,
                                    "title": "2.1. tofu-animation",
                                    "pages": [
                                        {
                                            "id": 211,
                                            "title": "2.1.1. spooky-giraffe",
                                            "pages": []
                                        },
                                        {
                                            "id": 212,
                                            "title": "2.1.2. bubble-burst",
                                            "pages": []
                                        }
                                    ]
                                },
                                {
                                    "id": 22,
                                    "title": "2.2. barehand-atomsplitting",
                                    "pages": []
                                }
                            ]
                        },
                        {
                            "id": 3,
                            "title": "3. unicorn-zapper",
                            "pages": []
                        },
                        {
                            "id": 4,
                            "title": "4. romantic-transclusion",
                            "pages": []
                        }];
                    _sitemap.push(_site);
                    console.log(_sitemap);
                    resolve();
                }));
            };
            for (var i = 0, len = sites.length; i < len; i++) {
                sitePromise(sites.at(i));
            }
            Promise.all(sitePromises).then(function () {
                res.end(JSON.stringify(_sitemap));
            });
        });
    }
}

module.exports = sitemap;
