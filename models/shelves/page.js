'use strict';

var OleBookshelf = require('./base');
var Promise = require('bluebird');
var pageForm = require('../forms/page');
var PageRenderHelper = require('../../models/helpers/page_render');
var _ = require('lodash');

/**
 * Parent Model Types Mapping
 * @type {Function}
 */
var getParentModelTypes = function () {
    return {
        chapter: OleBookshelf.model('Chapter'),
        issue: OleBookshelf.model('Issue'),
        lookbook: OleBookshelf.model('Lookbook')
    };
};

/**
 * Parent Collection Types Mapping
 * @type {Function}
 */
var getParentCollectionTypes = function () {
    return {
        chapter: OleBookshelf.collection('Chapters'),
        issue: OleBookshelf.collection('Issues'),
        lookbook: OleBookshelf.collection('Lookbooks')
    };
};

var Page = OleBookshelf.Model.extend(
    // Instance Methods
    {
        tableName: 'page',
        particles: function () {
            return this.hasMany('Particles');
        },
        categories: function () {
            return this.belongsToMany('Categories');
        },
        // Initialize
        initialize: function () {
            // Destroying Hook for Removing Category Entries In The Through Table
            this.on('destroying', function () {
                return OleBookshelf.knex('category_page').where('page_id', '=', this.get('id')).delete();
            });
        },
        /**
         * Fetch A Page With Particles In Order
         */
        fetchWithOrderedParticles: function () {
            // Fetch With Particles Ordered By Position
            return this.fetch({
                withRelated: [
                    {
                        'particles': function (qb) {
                            qb.orderBy('position', 'ASC');
                        }
                    }
                ]
            });
        },
        /**
         * Load Ordered Particles Into Existing Page Model
         * @returns {*}
         */
        loadOrderedParticles: function () {
            return this.load([
                {
                    'particles': function (qb) {
                        qb.orderBy('position', 'ASC');
                    }
                }
            ]);
        },
        /**
         * @param [skinPack]
         * @param [useWrapper]
         * @param [locals]
         * @returns {string}
         */
        renderPage: function (skinPack, useWrapper, locals) {
            var pageRenderHelper = new PageRenderHelper(this, skinPack);
            // Add this model to locals
            if (!locals) {
                locals = {};
            }
            locals.page = this;
            // Render
            return pageRenderHelper.render(useWrapper, locals);
        },
        /**
         * Get Parent Url
         */
        getParentUrl: function () {
            if (this.get('parent_type') === 'chapter') {
                return '/ole/cms/lookbook/' + this.get('lookbook_id') + '/chapter/update/' + this.get('parent_id');
            } else if (this.get('parent_type') === 'issue') {
                return '/ole/magazine/update/' + this.get('parent_id');
            } else if (this.get('parent_type') === 'lookbook') {
                return '/ole/cms/lookbook/update/' + this.get('parent_id');
            } else {
                return false;
            }
        },


//        /*
//         function to locate the handling page for public requests.
//         */
//        function find_requested($request) {
//    $page = $this;
//    $found = true;
//    for($i=0, $limit = count($request); $i<$limit; $i++) {
//        if($request[$i]) {
//            $next = $page->ChildWithURL($request[$i]);
//            if(!$next || !$page->publiclyVisible()) {
//                $found = false;
//                break;
//            }
//            $page = $next;
//            if($page->service) {
//                break;
//            }
//        }
//    }
//    return array(&$page, $found);
//}



/**
         * Update Search Field From Children Particles
         * Gets Child Particle Search Content, Then Joins It All
         * Adds to Model
         */
        updateSearchField: function () {
            // TET
            var _this = this;
            // Query
            return OleBookshelf.knex('particle').select('search_field').where('page_id', _this.get('id')).then(function (results) {
                return Promise.resolve(_.pluck(results, 'search_field').join(' '));
            }).then(function (searchFieldResults) {
                // Set On Page
                _this.set('search_field', searchFieldResults);
                // Save
                return _this.save();
            });
        },
        // Save Categories For The Page
        saveCategories: function (categoryArray) {
            if (!Array.isArray(categoryArray)) {
                categoryArray = [categoryArray];
            }
            // TET
            var _this = this;
            // Return Promise
            return new Promise(function (resolve, reject) {
                // Delete All
                return OleBookshelf.knex('category_page').where('page_id', _this.get('id')).del().then(function () {
                    // Make Array
                    var categories = [];
                    categoryArray.forEach(function (category) {
                        if (typeof category !== 'undefined') {
                            categories.push(
                                {
                                    category_id: category,
                                    page_id: _this.get('id')
                                }
                            );
                        }
                    });
                    // Insert All
                    if (categories.length > 0) {
                        return OleBookshelf.knex('category_page').insert(categories).then(function () {
                            // Perform Save on Issues Too
                            if (_this.get('parent_type') === 'issue') {
                                // Fetch Parent
                                return OleBookshelf.model('Issue').forge({id: _this.get('parent_id')}).fetch().then(function (issueModel) {
                                    // Check
                                    if (issueModel) {
                                        return issueModel.saveCategories().then(function () {
                                            return resolve(_this);
                                        });
                                    } else {
                                        return resolve(_this);
                                    }
                                });
                            } else {
                                return resolve(_this);
                            }
                        });
                    } else {
                        // Perform Save on Issues Too
                        if (_this.get('parent_type') === 'issue') {
                            // Fetch Parent
                            return OleBookshelf.model('Issue').forge({id: _this.get('parent_id')}).fetch().then(function (issueModel) {
                                // Check
                                if (issueModel) {
                                    return issueModel.saveCategories().then(function () {
                                        return resolve(_this);
                                    });
                                } else {
                                    return resolve(_this);
                                }
                            });
                        } else {
                            return resolve(_this);
                        }
                    }
                }).catch(reject);
            });
        },
        /**
         * Get Parent Model Class
         * @returns {*}
         */
        getParentModelClass: function () {
            return getParentModelTypes()[this.get('parent_type')];
        },
        /**
         * Get Parent Collection Class
         * @returns {*}
         */
        getParentCollectionClass: function () {
            return getParentCollectionTypes()[this.get('parent_type')];
        }
    },
    // Static Methods
    {
        getHighestPosition: function (pageId) {
            // Find Top Position
            return new Promise(function (resolve, reject) {
                OleBookshelf.knex('particle').where('page_id', pageId).select('position').orderBy('position', 'DESC').limit(1).then(function (results) {
                    // Top Position
                    var topPosition = false;
                    if (results && results.length > 0) {
                        topPosition = (results.shift().position);
                    }
                    // Resolve
                    resolve(topPosition);
                }).catch(function (e) {
                    // Reject
                    reject(e);
                });
            });
        },
        /**
         * Get Parent Model Class
         * @returns {*}
         */
        getParentModelClass: function (parentType) {
            return getParentModelTypes()[parentType];
        },
        /**
         * Get Parent Collection Class
         * @returns {*}
         */
        getParentCollectionClass: function (parentType) {
            return getParentCollectionTypes()[parentType];
        }
    });

var Pages = OleBookshelf.Collection.extend({
    model: Page
});

module.exports = {
    Page: OleBookshelf.model('Page', Page),
    Pages: OleBookshelf.collection('Pages', Pages),
    Form: pageForm
};