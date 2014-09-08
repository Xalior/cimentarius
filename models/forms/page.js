'use strict';

var BraidsBase = require('braids');
var Promise = require('bluebird');
var OleBookshelf = require('../shelves/base');

/**
 * Braids Form & Validation Model
 * @type {*}
 */
module.exports = BraidsBase.Model.Extend(
    {
        name: 'page',
        fields: [
            'templateName', 'title', 'url', 'parent_id', 'metaDescription', 'published', 'follow_on', 'cover_title', 'cover_summary', 'article_image'
        ],
        labels: {
            templateName: 'Template Name',
            title: 'Page Title',
            url: 'Page URL Key',
            metaDescription: 'Meta Description',
            published: 'Publish Status',
            follow_on: 'Follow On From Previous',
            article_image: 'Article Thumbnail'
        },
        hints: {
            published: 'When set to false, this page will not be available to view in the magazine.',
            url: 'This url must be unique within the context of each magazine but can be the same as a page url used on other magazines.',
            follow_on: 'Set to no if this is a standalone page or the first page of an article.',
            article_image: 'If this is the first page of an article, set an image to be displayed on the category pages.',
            cover_title: 'If this is the first page of an article, set a title to be displayed on the contents & category pages.<br />If no cover title is set, the page title will be used by default.',
            cover_summary: 'If this is the first page of an an article, set a summary to be displayed on the contents & category page.',
            metaDescription: 'SEO meta description of the page\'s content.'
        },
        joiValidators: {
            templateName: BraidsBase.joi.string().required(),
            title: BraidsBase.joi.string().required(),
            url: BraidsBase.joi.string().required(),
            parent_id: BraidsBase.joi.string().required(),
            metaDescription: BraidsBase.joi.any(),
            published: BraidsBase.joi.number().required(),
            follow_on: BraidsBase.joi.number().required(),
            cover_title: BraidsBase.joi.string().allow(''),
            cover_summary: BraidsBase.joi.string().allow('')
        },
        fileValidators: {
            cover_image: BraidsBase.FileValidator.Extend({
                required: true,
                maxFileSize: '200kb',
                validMimeTypes: ['image/*']
            })
        },
        customValidators: {
            url: function (value, model) {
                // Get Parent Model Type
                return new Promise(function (resolve, reject) {
                    // Check Parent Model
                    if (model.parentType && model.currentPageId) {
                        // Fetch Url Dupes
                        return OleBookshelf.collection('Pages').forge().query(function (qb) {
                            qb.where('parent_type', model.parentType);
                            qb.where('parent_id', model.parent_id);
                            qb.where('id', '!=', model.currentPageId);
                            qb.where('url', value);
                        }).fetch().then(function(pageCollection) {
                            if (pageCollection.models.length) {
                                return resolve('This URL is already in use!');
                            } else {
                                return resolve(true);
                            }
                        });
                    } else {
                        // Just Resolve
                        resolve(true);
                    }
                });
            }
        }
    }
);