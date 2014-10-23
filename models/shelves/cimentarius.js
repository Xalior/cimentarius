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
        this.on('fetching', this._beforeFetch);
        this.on('fetched', this._postFetch);
    },
    _beforeSave: function (model, attrs, options) {
//        if (model.attributes.created_at) delete(model.attributes.created_at);
    },
    _postSave: function(model, attrs, options) {},
    _beforeDelete: function (model, attrs, options) {},
    _postDelete: function (model, attrs, options) {},
    _beforeFetch: function (model, columns, options) {},
    _postFetch: function (model, resp, options) {}
});

// Exports
module.exports = CimentariusBookshelf;
