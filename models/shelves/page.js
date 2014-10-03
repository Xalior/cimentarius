'use strict';

var CimentariusBookshelf = require('./cimentarius'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    Checkit = require('checkit');

//var pageForm = require('../forms/page');
//var PageRenderHelper = require('../../models/helpers/page_render');

/**
 * Parent Model Types Mapping
 * @type {Function}
 */
var getParentModelTypes = function () {
    return {
        page: CimentariusBookshelf.model('Page')
    };
};

/**
 * Parent Collection Types Mapping
 * @type {Function}
 */
var getParentCollectionTypes = function () {
    return {
        page: CimentariusBookshelf.collection('Pages')
    };
};

var Page = CimentariusBookshelf.Model.extend(
    // Instance Methods
    {
        tableName: 'page',

        particles: function () {
            return this.hasMany('Particles');
        },
        // Initialize
        initialize: function () {
            // Destroying Hook for Removing Category Entries In The Through Table
            this.on('destroying', function () {
                console.log('destroying');
                console.log(this);
//                return CimentariusBookshelf.knex('category_page').where('page_id', '=', this.get('id')).delete();
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
         * Validate this model
         */
        validate: function(callback) {
            if(!this.validator) {
                console.log(this.validatorRules);
                this.validator = new Checkit(this.validatorRules.compulsory);
                for(var i = 0; i < this.validatorRules.maybe.length; i++) {
                    this.validator.maybe(this.validatorRules.maybe[i].rules,
                        this.validatorRules.maybe[i].handler)

                }
            }
            return this.validator.run(this.attributes).then(function(validated) {
                console.log(validated);
                return validated;
            }).catch(Checkit.Error, function(err) {
                console.log(err.toJSON());
                return err;
            })
        },
        validator: null,
        validatorRules: {
            compulsory: {
                parent_type: 'required',
                parent_id: 'required',
                title: 'required'
            },
            maybe:[{
                rules: { slug: ['required',
                                function(val) {
                                    console.log(val);
                                    return CimentariusBookshelf.knex('page')
                                        .where('parent_id', '=', input.parent_id)
                                        .where('slug', '=', val)
                                        .then(function (resp) {
                                        if (resp.length > 0) throw new Error('The slug is already in use.')
                                    })
                                }]
                },
                handler: function(input) {
                    return input.parent_type != 'site';
                }
            }]
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
            return CimentariusBookshelf.knex('particle').select('search_field').where('page_id', _this.get('id')).then(function (results) {
                return Promise.resolve(_.pluck(results, 'search_field').join(' '));
            }).then(function (searchFieldResults) {
                // Set On Page
                _this.set('search_field', searchFieldResults);
                // Save
                return _this.save();
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

var Pages = CimentariusBookshelf.Collection.extend({
    model: Page
});

module.exports = {
    Page: CimentariusBookshelf.model('Page', Page),
    Pages: CimentariusBookshelf.collection('Pages', Pages)
//    Form: pageForm
};