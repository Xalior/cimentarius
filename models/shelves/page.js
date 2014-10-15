'use strict';

var config = require('../../config/config'),
    CimentariusBookshelf = require('./cimentarius'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    TemplateHelper = require('../../lib/helpers/template.js'),
    Checkit = require('checkit');

//var pageForm = require('../forms/page');
//var PageRenderHelper = require('../../models/helpers/page_render');

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
            return this.hasMany('Particles');
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
            return console.log("CimentariusBookshelf.knex('PARTICLES AND STUFFS').where('id', '='," + this.get('id') + ").where('delete();)");
        },
        form: function(res) {
            var fn = function(data, err) {
                if(err) {
                    return send(res, render('err/500.swig', {err: err}), 500);
                } else {
                    return data;
                }
            };

            return res._render(res, 'page.swig', {
                page: JSON.stringify(this.toJSON({shallow: true}))
            }, fn, '_forms', 'admin');
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
    Page: CimentariusBookshelf.model('Page', Page),
    Pages: CimentariusBookshelf.collection('Pages', Pages)
//    Form: pageForm
};