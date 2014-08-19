var Bookshelf = require('bookshelf'),
    dbConfig = require('../database/config'),
    CimentariusBookshelf;

// Initialise
CimentariusBookshelf = Bookshelf.cimentarius = Bookshelf.initialize(dbConfig.config());

// Registry Plugin
CimentariusBookshelf.plugin('registry');

// Base Model
CimentariusBookshelf.Model = Bookshelf.cimentarius.Model.extend({
    hasTimestamps: ['created_at', 'updated_at']
});

// Exports
module.exports = CimentariusBookshelf;
