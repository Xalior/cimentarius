'use strict';

var config = require('../../config/config'),
    CimentariusBookshelf = require('./cimentarius'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    Site = require('../../models/shelves/site').model,
    Particle = require('../../models/shelves/particle').model,
    Checkit = require('checkit');

var Page = CimentariusBookshelf.Model.extend(
    // Instance Methods
    {
        // Constructor
        constructor: function () {
            // Call Parent
            CimentariusBookshelf.Model.apply(this, arguments);
        },
        tableName: 'page',

        particles: function () {
            return Particle.forge({
                parent_type: 'page',
                parent_id: this.id
            }).fetchAll().then(function(particles){
                return particles;
            });
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
        // Get Searchable Body Data
        getSearchableBodyData: function () {
            // Body Data
            var bodyData = [];
            // Get Fields
            var searchableFields = this.searchFields;
            // Check
            if (searchableFields) {
                // Iterate
                for (var i = 0; i < searchableFields.length; i++) {
                    // Get Field Identifier
                    var field = searchableFields[i];
                    // Get Field Content
                    var fieldContent = striptags(this.getContent()[field]);
                    // Add
                    bodyData.push(fieldContent);
                }
            }
            // Return
            return Promise.resolve(bodyData.join(' '));
        },
        /*
         * Prepare for saving, remove data that messes up the save event
         */
        _beforeSave: function (model, attrs, options) {
            CimentariusBookshelf.Model.prototype._beforeSave.apply(this, arguments);
            // Remove dynamic fields
            if (model.attributes.template) delete(model.attributes.template);
            if (model.attributes.type) delete(model.attributes.type);
            return new Promise(function (resolve, reject) {
                // Get Searchable Data
                model.getSearchableBodyData().then(function (searchableBodyData) {
                    // Set Searchable Body
                    model.set('search_field', searchableBodyData);
                    // Resolve
                    resolve(searchableBodyData);
                }).catch(function (e) {
                    // Error
                    reject(e);
                });
            });
        },
        /*
         * Various 'fake' fields, save related auto.
         */
        _postSave: function(model, attrs, options) {
            // Re-add dynamic fields
            model.attributes.type = 'page';
        },
        _postFetch: function (model, resp, options) {
            // Aadd dynamic fields
            model.attributes.type = 'page';
        },
        _beforeDelete: function (model, attrs, options) {
            console.log('destroying');
            console.log(this);
            new Page().where({'parent_type': 'page', 'parent_id': this.id}).fetchAll()
                .then(function (pages) {
                    pages.each(function(page) {
                        page.destroy();
                    });
                }
            );

            new Particle().where({'parent_type': 'page', 'parent_id': this.id}).fetchAll()
                .then(function (particles) {
                    particles.each(function(particle) {
                        particle.destroy();
                    });
                }
            );
        },
        form: function(res) {
            var fn = function(data, err) {
                if(err) {
                    return res.errorAdmin(500, "Error generating Page form");
                } else {
                    return data;
                }
            };

            return res._render(res, 'page.swig', {
                page: JSON.stringify(this.toJSON({shallow: false}))
            }, fn, '_forms', 'admin');
        },
        findSite: function() {
            var _that = this;
            switch (this.get('parent_type')) {
                // generalise this to use the permitted parents array
                case('page'):
                    return new Page().where({id: _that.get('parent_id')}).fetch().then(function (_parentShelf) {
                        return _parentShelf.findSite(_parentShelf);
                    });
                case('site'):
                    return new Site().where({id: _that.get('parent_id')}).fetch().then(function (_site) {
                        return _site;
                    });
                default:
                    console.log('default switch in findSite');
            }
        },
        /**
         * Validate this model
         */
        validate: function() {

            if(!this.validator) {
                this.validator = new Checkit(this.validatorRules.compulsory);
                for(var i = 0; i < this.validatorRules.maybe.length; i++) {
                    this.validator.maybe(this.validatorRules.maybe[i].rules,
                        this.validatorRules.maybe[i].handler);
                }
            }
            return this.validator.run(this.toJSON({shallow: true})).then(function(validated) {
                return validated;
            }).catch(Checkit.Error, function(err) {
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
                        return CimentariusBookshelf.knex('page')
                            .where('parent_id', '=', this.target.parent_id)
                            .where('id', '!=', this.target.id)
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
        }
    }, {
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
        permittedParents: function() {
            return [
                {
                    type: '_builtin',
                    name: 'page'
                },
                {
                    type: '_builtin',
                    name: 'site'
                },
            ]
        }

    }
);

var Pages = CimentariusBookshelf.Collection.extend({
    model: Page
});

module.exports = {
    model: CimentariusBookshelf.model('Page', Page),
    collection: CimentariusBookshelf.collection('Pages', Pages)
//    Form: pageForm
};