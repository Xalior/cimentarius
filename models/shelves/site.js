'use strict';

var CimentariusBookshelf = require('./cimentarius');
var Promise = require('bluebird');
var _ = require('lodash');

var Site = CimentariusBookshelf.Model.extend(
    // Instance Methods
    {
        tableName: 'site',
        particles: function () {
            return this.hasMany('Pages');
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
        /*
         *
         */
        getPreference: function (name) {
            switch(name) {
                case 'default_page_template':
                    return 'default';
                case 'template_pack':
                    return 'default';

            }
        },
        /**
         * Fetch A Page With Particles In Order
         */
        fetchWithOrderedPages: function () {
            // Fetch With Particles Ordered By Position
            return this.fetch({
                withRelated: [
                    {
                        'pages': function (qb) {
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
        loadOrderedPages: function () {
            return this.load([
                {
                    'pages': function (qb) {
                        qb.orderBy('position', 'ASC');
                    }
                }
            ]);
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

var Sites = CimentariusBookshelf.Collection.extend({
    model: Site
});

module.exports = {
    Site: CimentariusBookshelf.model('Site', Site),
    Sites: CimentariusBookshelf.collection('Sites', Sites)
//    Form: pageForm
};