'use strict';

var config = require('../../config/config');
var Promise = require('bluebird');

var ContentHelper = {
    getTypes: function() {
        return {
            '_builtin': {
                'displayName' : 'Built-in',
                'contentTypes' : {
                    'text': {
                        className: 'glyphicon-pencil',
                        displayName: 'Text',
                        description: 'Text based content',
                        summary: 'SEO Friendly text based markup'
                    },
                    'image': {
                        className: 'glyphicon-picture',
                        displayName: 'Image',
                        description: 'Pictorial content',
                        summary: 'Simple images, with heading, summary, etc.'
                    }
                }
            }
        }
    },
    getFilteredTypes: function(filter) {
        if (filter=='*') filter='*/*'
        if (!filter.contains('/')) return(null);
        filter = filter.split('/');
        console.log(filter);
        return ContentHelper.getTypes();
    }
};
/**
 * Get The Top Menu As A JS Object From Magento
 * @param req
 */
module.exports = ContentHelper;
