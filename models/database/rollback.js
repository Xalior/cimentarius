'use strict';

var nconf = require('nconf');
var Promise = require('bluebird');

// Handle Nconf
if (require.main.filename.indexOf('rollback.js') !== -1) {
    // Require FS
    var fs = require('fs');
    // Patches JSON
    require('jsonminify');
    // Read File
    var jsonConfig = fs.readFileSync('config/app.json', 'utf8');
    // Remove Comments Etc
    jsonConfig = JSON.minify(jsonConfig);
    // Parse
    if (typeof jsonConfig === 'string' && jsonConfig.length > 0) {
        jsonConfig = JSON.parse(jsonConfig);
    }
    // Pass to nconf
    nconf.use('config/app.json', {
        type: 'literal',
        store: jsonConfig
    });
}

// Other Requires Dependant on Nconf/DB Config
var OleBookshelf = require('../shelves/base');

// Knex Instance
var knex = OleBookshelf.knex;

// Table Creation Promises
var tablePromises = [];

tablePromises.push(knex.migrate.rollback(
    {directory: __dirname + '/migrations'}
));

// All Done
Promise.all(tablePromises).then(function () {
    // Report
    console.log('Rollback Complete!');
    process.exit();
});