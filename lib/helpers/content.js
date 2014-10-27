'use strict';

var config = require('../../config/config');
var Promise = require('bluebird');

var ContentHelper = {
    getAllTypes: function() {
        return {
            '_builtin': {
                'displayName' : 'Built-in',
                'types' : {
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
        // this needs to actually pool plugins, etc, to build this list - find things that can hold particles.
        return {
            '_builtin': {
                'displayName' : 'Built-in',
                'types' : {
                    'page': {
                        className: 'glyphicon-book',
                        displayName: 'Page',
                        description: 'Basic Page',
                        summary: 'A \'generic\' page of content',
                        model: require('../../models/shelves/page')
                    }
                }
            }
        }
    },
    getFilteredTypes: function(filter) {
        console.log("filtering on "+filter);
        var _allContent = ContentHelper.getAllTypes();

        if ((!filter) || (filter=='*')) filter='*:*'
        if (!filter.contains(':')) return(null);
        filter = filter.split(':');
        console.log(filter);
        var _module = _allContent[filter[0]];
        if(typeof _module != "object") return(null);
        return(_module.types[filter[1]]);
    }
};
/**
 * Get The Top Menu As A JS Object From Magento
 * @param req
 */
module.exports = ContentHelper;
