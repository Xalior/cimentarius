var Bookshelf = require('bookshelf'),
    dbConfig = require('../database/config'),
    CimentariusBookshelf;

// Initialise
CimentariusBookshelf = Bookshelf.cimentarius = Bookshelf.initialize(dbConfig.config());

// Registry Plugin
CimentariusBookshelf.plugin('registry');

// Base Model
CimentariusBookshelf.Model = Bookshelf.cimentarius.Model.extend({
    hasTimestamps: ['created_at', 'updated_at'],

    // Initialize
    initialize: function () {
        this.on('saving', this._beforeSave);
        this.on('saved', this._postSave);
        this.on('destroying', this._beforeDelete);
        this.on('destroyed', this._postDelete);
    },
    _beforeSave: function (model, attrs, options) {},
    _postSave: function(model, attrs, options) {},
    _postDelete: function (model, attrs, options) {},
    _beforeDelete: function (model, attrs, options) {}
});

// Exports
module.exports = CimentariusBookshelf;
