'use strict';

var config = require('../../../config/config'),
    Site = require('../../../models/shelves/site').Site,
    Page = require('../../../models/shelves/page').Page,
    User = require('../../../models/shelves/admin/user').User;

var sitemap = {
    sitemap: function (requestPath, req, res) {
        var _sitemap = [
            {
                title: 'First Site - Fakey!',
                comment: 'Comment about shite',
                pages: [
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
                    }]
            },
            {
                title: 'Dynamic Group Header - 2',
                comment: 'Dynamic Group Body - 2',
                pages: []
            }
        ];

        res.end(JSON.stringify(_sitemap));
    }
}

module.exports = sitemap;
