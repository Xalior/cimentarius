'use strict';

var CimentariusBookshelf = require('./cimentarius'),
    _ = require('lodash'),
    fs = require('fs'),
    Promise = require('bluebird'),
    config = require('../../config/config');

var Particle = CimentariusBookshelf.Model.extend(
    //Instance Methods
        {
        // Table Name
        tableName: 'particle',
        // Form Data
        formData: {
            fields: [],
            labels: {},
            joiValidators: {}
        },
        // Page Relation
        page: function () {
            return this.belongsTo('Page');
        },
        // Constructor
        constructor: function () {
            // Call Parent
            CimentariusBookshelf.Model.apply(this, arguments);
            // Form Instance
            if (!this.formData.customValidators) {
                this.formData.customValidators = {};
            }
            if (!this.formData.fields) {
                this.formData.fields = [];
            }
            if (!this.formData.labels) {
                this.formData.labels = {};
            }
            if (!this.formData.joiValidators) {
                this.formData.joiValidators = {};
            }
            // Form Data
            var formData = {
                name: this.type.toLowerCase(),
                fields: ['blockName', 'template' , 'position'].concat(this.formData.fields),
                labels: _.merge(this.formData.labels, {blockName: 'Content Block Name', position: 'Block Position'}),
                joiValidators: _.merge(this.formData.joiValidators, {blockName: BraidsBase.joi.string().required(), position: BraidsBase.joi.number().integer().required()}),
                customValidators: this.formData.customValidators
            };
            // Build Form By Merging Data
            this.form = BraidsBase.Model.Extend(_.merge(this.formData, formData));
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
                return model.related('page').fetch().then(function (pageModel) {
                    if (pageModel) {
                        // Return Update Method & Cache Method
                        var searchPromise = pageModel.updateSearchField(false);
                        return searchPromise.then(pageModel.save());
                    } else {
                        return Promise.resolve();
                    }
                });
            });
            // Pre-Delete Hook
            this.on('destroying', this._beforeDelete);
            // Post Delete Hook
            this.on('destroyed', this._postDelete);
        },
        // Set Type
        _setType: function () {
            // Check It's Not Already Set
            if (!this.get('type')) {
                // Set
                this.set('type', this.type);
            }
        },
        // Before Save
        _beforeSave: function (model, attrs, options) {
        },
        // Post Delete
        _postDelete: function (model, attrs, options) {
        },
        // Pre-Delete
        _beforeDelete: function (model, attrs, options) {
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

            // Name
            if (dataObject.blockName) {
                this.set('name', dataObject.blockName);
                delete dataObject.blockName;
            }

            // Template
            if (dataObject.template) {
                this.set('template', dataObject.template);
                delete dataObject.template;
            }

            // Serialize Other Data
            var data = {};
            _(dataObject).forEach(function (item, key) {
                // Not Base Attribute? Add to Content
                if (_this.baseAttributes.indexOf(key) === -1) {
                    data[key] = item;
                    delete dataObject[key];
                }
            });
            // Add Normal Data
            this.set(dataObject);
            // And Serialize The Content
            this.set('content', JSON.stringify(data));
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
        // Base Attributes
        baseAttributes: [
            'name', 'content_block', 'type', 'position', 'created_at', 'updated_at', 'id', 'page_id', 'content'
        ],
        getFormTemplatePath: function () {
            return __dirname + '/../../skins/admin/forms/' + this.type.toLowerCase() + '.swig';
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

var Particles = CimentariusBookshelf.Collection.extend({
    // Base Model
    model: Particle,
    // Constructor
    constructor: function () {
        // Call Parent
        OleBookshelf.Collection.apply(this, arguments);
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