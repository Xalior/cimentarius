'use strict';

var CimentariusBookshelf = require('../cimentarius'),
    Promise = require('bluebird'),
    Particle = require('../particle').Particle;

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
        // Search Fields
        searchFields: [
            'text'
        ],
        particleAttributes: [
            'body'
        ],
        // Description
        description: 'Basic Text',
        // Live Data Bindings
        livePreviewBindings: {
            text: 'text'
        },

        /*
         * Prepare for saving, remove data that messes up the save event
         */
        _beforeSave: function (model, attrs, options) {
            Particle.prototype._beforeSave.apply(this, arguments);
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
        validatorRules: {
            compulsory: {
                parent_type: 'required',
                parent_id: 'required',
                title: 'required',
                body: 'required'
            }
        },
        getSearchableBodyData: function () {
            var that = this;
            return new Promise(function(resolve, reject) {
                return resolve(that.get('title')+' '+that.get('body'));
            });
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