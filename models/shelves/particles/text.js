'use strict';

var OleBookshelf = require('../base');
var Promise = require('bluebird');
var Particle = require('../particle').Particle;
var BraidsBase = require('braids');

var validatePixelAmount = function (value) {
    if (value.endsWith('px') || value === '' || value === null) {
        return Promise.resolve(true);
    } else {
        return Promise.resolve('{{label}} must be in the format 120px, 100px etc OR 0');
    }
};

var TextParticle = Particle.extend(
    {
        // Type
        type: 'text',
        // Search Fields
        searchFields: [
            'text'
        ],
        // Description
        description: 'Particle For A Piece of Plain Text.',
        // Template
        template: 'text',
        // Live Preview
        livePreview: true,
        // Live Data Bindings
        livePreviewBindings: {
            text: 'text'
        },
        // Form Data
        formData: {
            fields: ['text', 'alignment', 'margin_top', 'margin_bottom', 'margin_right', 'margin_left', 'width', 'position_type', 'x_offset', 'y_offset', 'position_alignment', 'background_colour', 'border', 'padding', 'layer'],
            labels: {
                text: 'Text Content',
                alignment: 'Text Alignment',
                position_type: 'Text Position',
                border: 'Border (pullquote will default to solid)'
            },
            hints: {
                background_colour: 'Set the background colour on the caption. <br /> Can be set as css colour - "green", hex - "#008000" or rgb - "rgb(0, 128, 0)". <br /> It\'s also possible to set an opacity with rgba - "rgba(0, 128, 0, 0.5)".',
                border: 'Set a surrounding border for the text.<br />The default, title and subtitle templates can be set to have no border, but pullquote will default to solid when none is set',
                padding: 'Set the amount of space between the text and the border. The larger the padding, the smaller the space available to the text i.e. a width of 200px with a padding of 10px will leave a space of 180px for the text',
                width: 'Set the total width of the text box (text, padding & border)',
                position_type: 'Static: Text position can\'t be changed and layering can\'t be set.<br />' +
                    'Relative: Text can be re-positioned & given a layer, when the text is moved a gap will remain in the \'flow\' of the page where it originally would have been. <br />' +
                    'Absolute: Text can be re-positioned & given a layer, any particles beneath the image will flow up to fill the space.',
                y_offset: 'Vertical position of the text, relative to the top of the column.',
                x_offset: 'Horizontal position of the text, relative to either the left or right of the column.',
                position_alignment: 'Align the starting horizontal position of the text with right or left side of the column.',
                layer: 'Text layer can only be set when it has a relative or absolute position.'
            },
            joiValidators: {
                text: BraidsBase.joi.string().required(),
                alignment: BraidsBase.joi.string().required(),
                width: BraidsBase.joi.string().allow(''),
                margin_top: BraidsBase.joi.string().allow(''),
                margin_bottom: BraidsBase.joi.string().allow(''),
                margin_right: BraidsBase.joi.string().allow(''),
                margin_left: BraidsBase.joi.string().allow(''),
                x_offset: BraidsBase.joi.string().allow(''),
                y_offset: BraidsBase.joi.string().allow(''),
                background_colour: BraidsBase.joi.string().allow('')
            },
            customValidators: {
                width: validatePixelAmount,
                margin_top: validatePixelAmount,
                margin_bottom: validatePixelAmount,
                margin_right: validatePixelAmount,
                margin_left: validatePixelAmount,
                padding: validatePixelAmount
            },
            alignmentOptions: {
                left: 'Left',
                centre: 'Centre',
                right: 'Right'
            },
            positionOptions: {
                static: 'Static',
                relative: 'Relative',
                absolute: 'Absolute'
            },
            positionAlignmentOptions: {
                left: 'Left',
                right: 'Right'
            },
            borderOptions: {
                none: 'None',
                solid: 'Solid',
                dotted: 'Dotted',
                dashed: 'Dashed'
            }
        }
    }
);


var TextParticles = OleBookshelf.Collection.extend({
    model: TextParticle
});

module.exports = {
    Model: OleBookshelf.model('TextParticle', TextParticle),
    Collection: OleBookshelf.collection('TextParticles', TextParticles)
};