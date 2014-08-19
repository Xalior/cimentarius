'use strict';

var OleBookshelf = require('../base');
var Particle = require('../particle').Particle;
var BraidsBase = require('braids');

var validatePixelAmount = function (value) {
    if (value.endsWith('px') || value.endsWith('%') || value === '0' || value === 0) {
        return Promise.resolve(true);
    } else {
        return Promise.resolve('{{label}} must be in the format 120px, 100% etc OR 0');
    }
};

var ImageParticle = Particle.extend(
    {
        // Type
        type: 'image',
        // Description
        description: 'Particle For An Image.',
        // Template
        template: 'image',
        // Live Preview
        livePreview: true,
        // Form Data
        formData: {
            fields: ['src', 'alt_text', 'text', 'title', 'position_type', 'x_offset', 'y_offset', 'alignment', 'padding', 'caption_x_offset', 'caption_y_offset', 'caption_alignment', 'column_limit', 'link', 'background_colour', 'layer', 'hide_link_border'],
            labels: {
                src: 'Image Src Url',
                text: 'Inline Caption',
                alt_text: 'Alt Text',
                title: 'Title',
                position_type: 'Image Position',
                padding: 'Image Padding',
                column_limit: 'Limit image to Column width',
                hide_link_border: 'Hide link border'
            },
            hints: {
                alt_text: 'Set a description of the image',
                column_limit: 'When set to true, large images will be shrunk to fit in the column.<br />When set to false, large images can be set and won\'t be limited to the size of the column.',
                background_colour: 'Set the background colour on the caption. <br /> Can be set as css colour - "green", hex - "#008000" or rgb - "rgb(0, 128, 0)". <br /> It\'s also possible to set an opacity with rgba - "rgba(0, 128, 0, 0.5)".',
                caption_y_offset: 'Vertical position of the inline text caption, relative to the top of the image.',
                caption_x_offset: 'Horizontal position of the inline text caption, relative to either the left or right of the image.',
                caption_alignment: 'Align the starting horizontal position of the caption with right or left side of the image.',
                position_type: 'Static: Image position can\'t be changed and layering can\'t be set.<br />' +
                                'Relative: Image can be re-positioned & given a layer, when the image is moved a gap will remain in the \'flow\' of the page where it originally would have been. <br />' +
                                'Absolute: Image can be re-positioned & given a layer, any particles beneath the image will flow up to fill the space.',
                y_offset: 'Vertical position of the image, relative to the top of the column.',
                x_offset: 'Horizontal position of the image, relative to either the left or right of the column.',
                alignment: 'Align the starting horizontal position of the image with right or left side of the column.',
                layer: 'Image layer can only be set when it has a relative or absolute position.',
                hide_link_border: 'Set whether a border should appear around the link when the cursor is hovering over it.'
            },
            joiValidators: {
                src: BraidsBase.joi.string().required(),
                alt_text: BraidsBase.joi.string().required(),
                title: BraidsBase.joi.string().allow(''),
                text: BraidsBase.joi.string().allow(''),
                x_offset: BraidsBase.joi.string().allow(''),
                y_offset: BraidsBase.joi.string().allow(''),
                padding: BraidsBase.joi.string().allow(''),
                link: BraidsBase.joi.string().allow(''),
                background_colour: BraidsBase.joi.string().allow(''),
                layer: BraidsBase.joi.string().allow('')
            },
            positionOptions: {
                static: 'Static',
                relative: 'Relative',
                absolute: 'Absolute'
            },
            alignmentOptions: {
                left: 'Left',
                right: 'Right'
            },
            trueFalseOptions: {
                true: 'True',
                false: 'False'
            },
            falseTrueOptions: {
                false: 'False',
                true: 'True'
            }
        },
        searchFields: [
            'text',
            'alt_text',
            'title'
        ]
    }
);


var ImageParticles = OleBookshelf.Collection.extend({
    model: ImageParticle
});

module.exports = {
    Model: OleBookshelf.model('ImageParticle', ImageParticle),
    Collection: OleBookshelf.collection('ImageParticles', ImageParticles)
};