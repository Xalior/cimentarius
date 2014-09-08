'use strict';

var config = require('../../lib/config');
var Promise = require('bluebird');

var CimentariusBookshelf = require('../shelves/cimentarius');

// Knex Instance
var knex = CimentariusBookshelf.knex;

// Table Creation Promises
var tablePromises = [];

// User Table
tablePromises.push(new Promise(function (resolve) {
    knex.schema.hasTable('user').then(function(exists) {
        if (exists) {
            console.log('Users Table Already Exists');
            resolve();
        } else {
            knex.schema.createTable('user',function(t) {
                t.increments('id');
                t.string('username');
                t.string('password');
                t.string('email');
                t.integer('group_id');
                t.dateTime('last_seen');
                t.timestamps();
            }).then(function() {
                console.log('Users Table Created');
                resolve();
            });
        }
    });
}));

// Site Table
tablePromises.push(new Promise(function (resolve) {
    knex.schema.hasTable('site').then(function (exists) {
        if (exists) {
            console.log('Site Table Already Exists');
            resolve();
        } else {
            knex.schema.createTable('site', function (t) {
                t.increments('id');
                // entity ID to look up in remote parent type table
                t.string('title');
                // and a url-part
                t.string('primary_domain');
                // pages also contain metashit, for SEO purposes.
                t.string('other_domains');
                t.timestamps();
            }).then(function () {
                console.log('Site Table Created');
                resolve();
            });
        }
    });
}));

// Page Table
tablePromises.push(new Promise(function (resolve) {
    knex.schema.hasTable('page').then(function (exists) {
        if (exists) {
            console.log('Page Table Already Exists');
            resolve();
        } else {
            knex.schema.createTable('page', function (t) {
                t.increments('id');
                // probably page - maybe site, or a service... :-o
                t.string('parent_type');
                // entity ID to look up in remote parent type table
                t.integer('parent_id');
                // page title (human readable formatt
                t.string('title');
                // pages need rendering templates (by name)
                t.string('templateName');
                // and a url-part
                t.string('slug');
                // pages also contain metashit, for SEO purposes.
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
