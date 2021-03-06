'use strict';

var glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    Promise = require('bluebird');
var ContentHelper = require('./content');

var TemplateHelper = {
    /**
     * Page Template Parsing Regex
     * @type {RegExp}
     */
    templateRegex: /{#CONTENT_BLOCK ([a-zA-Z0-9_]*) ([0-9]*|\*) \((.*?)\) *(.*) #}/gm,

    getTemplatePath: function(templatePack, type) {
        var module = '_builtin';
        if(type.contains(':')) {
            var _typeParts = type.split(':');
            type = _typeParts[1];
            module = _typeParts[0];
        }
        var _path;
        if(module=='_builtin') {
            _path = path.resolve(__dirname + '/../../views/public/' + templatePack + '/' + type);
            if (!fs.exists(_path))
                _path = path.resolve(__dirname + '/../../views/public/default/' + type);
        } else {
            _path = path.resolve(__dirname + '/../../views/public/' + templatePack + '/plugins/' + module + '/' + type);
            if (!fs.exists(_path))
                _path = path.resolve(__dirname + '/../../plugins/' + module + '/views/public/' + type);
        }
        return _path;
    },

    getTemplatesFor: function(templatePack, type) {
        var _templatePath = TemplateHelper.getTemplatePath(templatePack,type);
        return new Promise(function (resolve, reject) {
            var _pageTemplates = [];
            glob(_templatePath + '/*.swig', function (err, files) {
                if (err) {
                    reject(new Error(err));
                } else {
                    // Leap Over
                    for (var i = 0; i < files.length; i++) {
                        // Parse
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
//        template.desc = fs.readFileSync(templatePath + template.filename + '.txt');

        // Content Block
        template.contentBlocks = [];
        // Regex
        var match;
        while (match = TemplateHelper.templateRegex.exec(fileContents)) {
            var contentBlock = {};
            contentBlock.name = match[1];
            contentBlock.limit = match[2];
            if (match[3] === '*') {
                contentBlock.types = ContentHelper.getAllTypes();
            } else {
                contentBlock.types = ContentHelper.getFilteredTypes(match[3]);
            }
            contentBlock.description = match[4];
            template.contentBlocks.push(contentBlock);
        }
        return template;
    }
}

module.exports = TemplateHelper;