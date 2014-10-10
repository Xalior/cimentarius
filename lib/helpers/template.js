'use strict';

var glob = require('glob'),
    fs = require('fs'),
    path = require('path');
var Promise = require('bluebird');
//var ContentHelper = require('./content');

var TemplateHelper = {
    /**
     * Page Template Parsing Regex
     * @type {RegExp}
     */
    templateRegex: /{#CONTENT_BLOCK ([a-zA-Z0-9_]*) ([0-9]*|\*) \((.*?)\) *(.*) #}/gm,

    getTemplatePath: function(templatePack, type) {
        return path.resolve(__dirname + '../../../views/public/'+templatePack+'/'+type);
    },

    getTemplatesFor: function(templatePack, type) {
        var _templatePath = TemplateHelper.getTemplatePath(__dirname + '../../../views/public/'+templatePack+'/'+type);
        return new Promise(function (resolve, reject) {
            var _pageTemplates = [];
            glob(_templatePath + '/*.swig', function (err, files) {
                console.log(files);
                if (err) {
                    reject(new Error(err));
                } else {
                    // Leap Over
                    for (var i = 0; i < files.length; i++) {
                        // Parse
                        console.log(files[i]);
                        _pageTemplates.push(files[i]);
                    }
                    // Callback
                    resolve(_pageTemplates);
                }
            });
        });
    },

    /**
     * Parse a Template File
     * @param fileLocation
     */
    parseTemplate: function (fileLocation) {
        // Read File Contents
        var fileContents = fs.readFileSync(fileLocation, 'utf8');
        // Template
        var template = {};
        // Filename
        template.filename = path.basename(fileLocation, '.swig');
        template.imgSrc = templateImgPath + template.filename + '.png';
        template.desc = fs.readFileSync(templatePath + template.filename + '.txt');

        // Content Block
        template.contentBlocks = [];
        // Regex
        var match;
        while (match = TemplateHelper.templateRegex.exec(fileContents)) {
            var contentBlock = {};
            contentBlock.name = match[1];
            contentBlock.limit = match[2];
            if (match[3] === '*') {
                contentBlock.contentTypes = particleTypes;
            } else {
                contentBlock.contentTypes = match[3].split(' ');
                // Also add alias because it can refer to the same particle types
                // @TODO - Enforce particle types on aliased content
                contentBlock.contentTypes.push('alias');
            }
            contentBlock.description = match[4];
            template.contentBlocks.push(contentBlock);
        }
        // Return
        return template;
    }
}

module.exports = TemplateHelper;