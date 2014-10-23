'use strict';

var CimentariusBookshelf = require('./cimentarius'),
    _ = require('lodash'),
    fs = require('fs'),
    Promise = require('bluebird'),
    config = require('../../config/config'),
    Checkit = require('checkit');

var Particle = CimentariusBookshelf.Model.extend(
    //Instance Methods
        {
        // Table Name
        tableName: 'particle',
        // Module
        module: '_builtin',
        // Form Data
        particleAttributes: [],
        particleData: [],
        // Constructor
        constructor: function () {
            // Call Parent
            CimentariusBookshelf.Model.apply(this, arguments);
        },
        // Init
        initialize: function () {
            // Saving Event
            this.on('saving', this._setType);
            this.on('saving', this._beforeSave);
            // Saving Hook for Search
            this.on('saving', function (model) {
                return new Promise(function (resolve, reject) {
                    // Get Searchable Data
                    model.getSearchableBodyData().then(function (searchableBodyData) {
                        // Set Searchable Body
                        model.set('search_field', searchableBodyData);
                        console.log(searchableBodyData);
                        // Resolve
                        resolve(searchableBodyData);
                    }).catch(function (e) {
                        // Error
                        reject(e);
                    });
                });
            });
            // Saved Hook for Search
            this.on('saved', function (model) {
                // Saved -> Get Page
                /*
                    return model.related('parent').fetch().then(function (pageModel) {
                        if (pageModel) {
                            // Return Update Method & Cache Method
                            var searchPromise = pageModel.updateSearchField(false);
                            return searchPromise.then(pageModel.save());
                        } else {
                            return Promise.resolve();
                        }
                    });
                */
            });
            // Pre-Delete Hook
            this.on('destroying', this._beforeDelete);
            // Post Delete Hook
            this.on('destroyed', this._postDelete);
        },
        toJSON: function(_opts) {
            var _json = CimentariusBookshelf.Model.prototype.toJSON.apply(this, arguments);
            _json.type = this.type;
            _json.module = this.module;
            return _json;
        },
        getSearchableBodyData: function () {
            return new Promise(function(resolve, reject) {
                return resolve(this.get('title'));
            });
        },
        _beforeSave: function (model, attrs, options) {
            CimentariusBookshelf.Model.prototype._beforeSave.apply(this, arguments);
            // Remove dynamic fields
            if (model.attributes.template) delete(model.attributes.template);
            if (model.attributes.description) delete(model.attributes.description);
            if (model.attributes.module) delete(model.attributes.module);
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
        /**
         * Validate this model
         */
        validate: function() {
            if(!this.validator) {
                this.validator = new Checkit(this.validatorRules.compulsory);
                if(this.validatorRules.maybe) {
                    for (var i = 0; i < this.validatorRules.maybe.length; i++) {
                        this.validator.maybe(this.validatorRules.maybe[i].rules,
                            this.validatorRules.maybe[i].handler);
                    }
                }
            }
            var _particleData = this.toJSON({shallow: true});
            _.assign(_particleData, JSON.parse(this.get('particle_data')));
            console.log("ready to validate:");
            console.log(_particleData);
            return this.validator.run(_particleData).then(function(validated) {
                return validated;
            }).catch(Checkit.Error, function(err) {
                return err;
            })
        },
        validator: null,
        // Set Type
        _setType: function () {
            // Check It's Not Already Set
            if (!this.get('type')) {
                // Set
                this.set('type', this.type);
            }
        },
        // Set Page ID
        setPageId: function (pageId) {
            this.set('page_id', pageId);
        },
        // Set Content Block
        setContentBlock: function (contentBlock) {
            this.set('content_block', contentBlock);
        },
        // Build Content Data
        buildContent: function (dataObject) {
            // TIT
            var _this = this;
            var data = {};
            _(dataObject).forEach(function (item, key) {
                // Not Base Attribute? Add to Content
                if (_this.particleAttributes.indexOf(key) === -1) {
                    data[key] = item;
                    delete dataObject[key];
                }
            });
            // Add Normal Data
            this.set(data);
            // And Serialize The Content
            this.set('particle_data', JSON.stringify(dataObject));
        },
        // Type
        type: 'Base',
        // Template
        template: 'default',
        // Description
        description: 'Abstract Base Particle. If You Can See This, Something Broke.',
        // Data
        data: {
            Error: 'Rendered The Base Template. Tsk Tsk.'
        },
        form: function(res) {
            var fn = function(data, err) {
                if(err) {
                    return res.errorAdmin(500, "Error generating Page form");
                } else {
                    return data;
                }
            };

            return res._render(res, this.type.toLowerCase() + '.swig', {
                particle: JSON.stringify(this.toJSON({shallow: true}))
            }, fn, '_forms/particles', 'admin');
        },
        getFormTemplatePath: function () {
            return __dirname + '/../../skins/admin/_forms/particles/' + this.type.toLowerCase() + '.swig';
        },
        getTemplateList: function () {
            // TET
            var _this = this;
            // Templates
            var templates = {};
            // Path Exists?
            if (fs.existsSync(__dirname + '/../../skins/default/desktop/particle/' + this.type.toLowerCase() + '/')) {
                // Get File List
                var fileList = fs.readdirSync((__dirname + '/../../skins/default/desktop/particle/' + this.type.toLowerCase() + '/'));
                // Iterate
                fileList.forEach(function (item) {
                    // Check It's Not A Directory
                    if (!fs.statSync(__dirname + '/../../skins/default/desktop/particle/' + _this.type.toLowerCase() + '/' + item).isDirectory()) {
                        var templateStringRepresentation = item.slice(0, -5);
                        templateStringRepresentation = templateStringRepresentation.replace(/_/g, ' ')
                            .replace(/(\w+)/g, function (match) {
                                return match.charAt(0).toUpperCase() + match.slice(1);
                            });
                        templates[item.slice(0, -5)] = templateStringRepresentation;
                    }
                });
            }
            return templates;
        },
        // Get The Content! Parse the JSON in the DB
        getContent: function () {
            // JSON Content Set?
            if (!this._jsonContent) {
                // Parse and Store
                try {
                    this._jsonContent = JSON.parse(this.get('content'));
                } catch (e) {
                    console.error('JSON Parse Error for particle ID ' + this.get('id') + ' which is type ' + this.get('type'));
                    console.error(e.stack ? e.stack : e);
                    return {};
                }
            }
            // Return
            return this._jsonContent;
        },
        // Get Additional Admin Form Data
        getAdditionalFormData: function () {
            return Promise.resolve();
        },
        // Get Additional Render Data
        getAdditionalRenderData: function () {
            return Promise.resolve(this);
        },
        /**
         * Get Edit Particle Url
         * @returns {string}
         */
        getEditUrl: function () {
            return '/ole/cms/particle/content_type/' + this.get('type') + '/update/' + this.get('id');
        }
    }, {
        permittedParents: function() {
            return [];
            //return [
            //    {
            //        type: '_builtin',
            //        name: 'page'
            //    },
            //    {
            //        type: '_builtin',
            //        name: 'site'
            //    },
            //]
        }
    }
);

var Particles = CimentariusBookshelf.Collection.extend({
    // Base Model
    model: Particle,
    // Constructor
    constructor: function () {
        // Call Parent
        CimentariusBookshelf.Collection.apply(this, arguments);
        // Post-Fetch Model Init
        this.on('fetched', function (collection, resp, options) {
            this.models.forEach(function (particleModel, key) {
                this.models[key] = replaceWithParticleType(particleModel);
            }, this);
        });
    },
    // Parse Into Proper Models
    parse: function (resp) {
        // Loop Over
        resp.forEach(function (particleModel, key) {
            resp[key] = replaceWithParticleType(particleModel);
        }, this);
        // Return
        return resp;
    }
});

var replaceWithParticleType = function (particleModel) {
    var returnObject = particleModel;
    // Check It's A Full Model
    if (_.isFunction(particleModel.get) && !particleModel.constructed) {
        // Type
        var particleType = particleModel.get('type');
        // Check
        if (particleTypeModels[particleType]) {
            returnObject = new (require('./particles/' + particleType).Model)(particleModel.attributes);
        } else {
            returnObject = particleModel;
        }
        // Set Constructed Flag
        returnObject.constructed = true;
    }
    // Return
    return returnObject;
};

module.exports = {
    Particle: CimentariusBookshelf.model('Particle', Particle),
    Particles: CimentariusBookshelf.collection('Particles', Particles)
};