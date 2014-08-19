'use strict';

var nconf = require('nconf');
var Promise = require('bluebird');
var _ = require('lodash');

/* global argv */

// Handle Nconf
if (require.main.filename.indexOf('create-migration.js') !== -1) {
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

var logError = function (err) {
    console.error(err.stack);
};

var err = function (msg) {
    console.error(msg);
};

var exit = function (statusCode) {
    if (knex && knex.client) {
        knex.client.pool.destroy();
    }
    process.exit(statusCode);
};

var success = _.partial(exit, 0);

var failure = function (err) {
    logError(err);
    exit(1);
};

var name = process.argv[2];

if (name === null) {
    return err('The name must be defined');
}

Promise.resolve().then(function () {
    return knex.migrate.make(name, {
        directory: __dirname + '/migrations'
    });
}).then(function (filename) {
    console.log('Migration ' + filename + ' created!');
}).catch(failure).then(success);
