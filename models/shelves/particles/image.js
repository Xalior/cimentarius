'use strict';

var CimentariusBookshelf = require('../cimentarius');
var Particle = require('../particle').model;

var validatePixelAmount = function (value) {
    if (value.endsWith('px') || value.endsWith('%') || value === '0' || value === 0) {
        return Promise.resolve(true);
    } else {
        return Promise.resolve('{{label}} must be in the format 120px, 100% etc OR 0');
    }
};

var Image = Particle.extend(
    {
        // Type
        type: 'image',
        // Description
        description: 'Basic Image',
        // Live Preview
        livePreview: true,
        searchFields: [
            'text',
            'alt_text',
            'title'
        ]
    }
);


var Images = CimentariusBookshelf.Collection.extend({
    model: Image
});

module.exports = {
    Model: CimentariusBookshelf.model('_builtin/Image', Image),
    Collection: CimentariusBookshelf.collection('_builtin/Images', Images)
};