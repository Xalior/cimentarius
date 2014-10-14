'use strict';

var config = require('../../config/config');
var Promise = require('bluebird');

var ContentHelper = {
    getAllTypes: function() {
        return {
            '_builtin': {
                'displayName' : 'Built-in',
                'contentTypes' : {
                    'text': {
                        className: 'glyphicon-pencil',
                        displayName: 'Text',
                        description: 'Text based content',
                        summary: 'SEO Friendly text based markup',
                        model: require('../../models/shelves/particles/text')
                    },
                    'image': {
                        className: 'glyphicon-picture',
                        displayName: 'Image',
                        description: 'Pictorial content',
                        summary: 'Simple images, with heading, summary, etc.',
                        model: require('../../models/shelves/particles/image')
                    }
                }
            }
        }
    },
    getAllParentTypes: function() {
        // this needs to actually pool plugins, etc, to build this list.
        return [
            {
                type: '_builtin',
                name: 'page',
                model: require('../../models/shelves/page').Page
            },
            {
                type: '_builtin',
                name: 'site',
                model: require('../../models/shelves/site').Site
            }
        ]
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
