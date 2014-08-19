'use strict';

var config = require('../../lib/config');
var Promise = require('bluebird');

var CimentariusBookshelf = require('../shelves/cimentarius');

// Knex Instance
var knex = CimentariusBookshelf.knex;

// Table Creation Promises
var tablePromises = [];

// Page Table
tablePromises.push(new Promise(function (resolve) {
    knex.schema.hasTable('page').then(function (exists) {
        if (exists) {
            console.log('Page Table Already Exists');
            resolve();
        } else {
            knex.schema.createTable('page', function (t) {
                t.increments('id');
                t.integer('parent_id');
                t.string('parent_type');
                t.string('title');
                t.string('templateName');
                t.string('url');
                t.string('metaDescription');
                t.timestamps();
            }).then(function () {
                console.log('Page Table Created');
                resolve();
            });
        }
    });
}));

// Particle Table
tablePromises.push(new Promise(function (resolve) {
    knex.schema.hasTable('particle').then(function (exists) {
        if (exists) {
            console.log('Particle Table Already Exists');
            resolve();
        } else {
            knex.schema.createTable('particle', function (t) {
                t.increments('id');
                t.integer('page_id');
                t.string('name');
                t.string('content_block');
                t.string('type');
                t.integer('position');
                t.text('content');
                t.timestamps();
            }).then(function () {
                console.log('Particle Table Created');
                resolve();
            });
        }
    });
}));

tablePromises.push(knex.migrate.latest(
    {directory: __dirname + '/migrations'}
));

// All Done
Promise.all(tablePromises).then(function () {
    // Report
    console.log('Tables Created Or Checked...');
    console.log('All done!');
    process.exit();
});
