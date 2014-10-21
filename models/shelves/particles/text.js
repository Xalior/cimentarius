'use strict';

var CimentariusBookshelf = require('../cimentarius');
var Promise = require('bluebird');
var Particle = require('../particle').Particle;

var validatePixelAmount = function (value) {
    if (value.endsWith('px') || value === '' || value === null) {
        return Promise.resolve(true);
    } else {
        return Promise.resolve('{{label}} must be in the format 120px, 100px etc OR 0');
    }
};

var Text = Particle.extend(
    // Instance Methods
    {
        // Type
        type: 'text',
        // Module
        module: '_buildin',
        // Search Fields
        searchFields: [
            'text'
        ],
        // Description
        description: 'Particle For A Piece of Plain Text.',
        // Live Data Bindings
        livePreviewBindings: {
            text: 'text'
        },

        /*
         * Prepare for saving, remove data that messes up the save event
         */
        _beforeSave: function (model, attrs, options) {
            CimentariusBookshelf.Model.prototype._beforeSave.apply(this, arguments);
            // Remove dynamic fields
            if (model.attributes.template) delete(model.attributes.template);

        },
        form: function(res) {
            var fn = function(data, err) {
                if(err) {
                    return res.errorAdmin(500, "Error generating Page form");
                } else {
                    return data;
                }
            };

            return res._render(res, 'particles/text.swig', {
                particle: JSON.stringify(this.toJSON({shallow: true}))
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
    },
    // Static methods
    {
    }
);


var Texts = CimentariusBookshelf.Collection.extend({
    model: Text
});

module.exports = {
    Model: CimentariusBookshelf.model('_builtin/Text', Text),
    Collection: CimentariusBookshelf.collection('_builtin/Texts', Texts)
};