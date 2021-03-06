'use strict';

var config = require('../../lib/config'),
    Promise = require('bluebird'),
    inquirer = require('inquirer'),
    auth = require('../../controllers/admin/auth'),
    User = require('../shelves/admin/user').User,
    Site = require('../shelves/site').Site,
    Page = require('../shelves/page').Page;

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
            console.log('Sites Table Already Exists');
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
                console.log('Sites Table Created');
                resolve();
            });
        }
    });
}));


// Settings Table
tablePromises.push(new Promise(function (resolve) {
    knex.schema.hasTable('setting').then(function (exists) {
        if (exists) {
            console.log('Settings Table Already Exists');
            resolve();
        } else {
            knex.schema.createTable('setting', function (t) {
                t.increments('id');
                // entity ID to look up in remote parent type table
                t.integer('site_id');
                // index order
                // settings title (human readable format)
                t.string('title');
                // settings need names
                t.string('name');
                // and probably have a value
                t.string('value');
                t.timestamps();
            }).then(function () {
                console.log('Settings Table Created');
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
                // index order
                t.integer('position');
                // page title (human readable format
                t.string('title');
                // pages need rendering templates (by name)
                t.string('templateName');
                // and a url-part
                t.string('slug');
                // pages also contain metashit, for SEO purposes.
                t.string('metaDescription');
                // searchable datacache - speeds up sub-particle search, required by beforeSave event
                t.text('search_field');
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
            console.log('Particles Table Already Exists');
            resolve();
        } else {
            knex.schema.createTable('particle', function (t) {
                t.increments('id');
                // probably page - maybe site, or a service... :-o
                t.string('parent_type');
                // entity ID to look up in remote parent type table
                t.integer('parent_id');
                // index order
                t.integer('position');
                // page title (human readable format
                t.string('title');
                // pages need rendering templates (by name)
                t.string('templateName');
                // and a block-part
                t.string('content_block');
                // Type of content
                t.string('type');
                t.text('particle_data');
                t.text('search_field');
                t.timestamps();
            }).then(function () {
                console.log('Particles Table Created');
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
    console.log('Tables Created Or Checked...!');

    // User Creation
    return knex('user').count('username as userCount').then(function(result) {
        // Count Users
        var userCount = result[0]['userCount'];
        // Need to create a user?
        if (userCount === 0) {
            return createNewUser();
        } else {
            // No New Users Required
            return console.log('(At Least One) User Account Already Exists!!');
        }
    });
}).then(function(){
    return knex('site').count('primary_domain as siteCount').then(function(result) {
        // Count Users
        var siteCount = result[0]['siteCount'];
        // Need to create a user?
        if (siteCount === 0) {
            return createNewSite();
        } else {
            // No New Users Required
            return console.log('(At Least One) Site Account Already Exists!');
        }
    });
}).then(function(){
    return knex('site').count('primary_domain as siteCount').then(function(result) {
        // Count Users
        var siteCount = result[0]['siteCount'];
        // Need to create a user?
        if (siteCount === 0) {
            return createNewSite();
        } else {
            // No New Users Required
            return console.log('(At Least One) Site Account Already Exists!');
        }
    });
}).then(function(){
    process.exit();
});

function createNewUser() {
    // Inquirer - Prompt
    inquirer.prompt([
        {
            type: 'input',
            name: 'adminEmail',
            message: 'Please Enter An Admin Email Address: ',
            filter: String
        },
        {
            type: 'input',
            name: 'adminUsername',
            message: 'Please Enter An Admin Username: ',
            filter: String
        },
        {
            type: 'password',
            name: 'adminPassword',
            message: 'Please Enter An Admin Password: ',
            filter: String
        }
    ], function(answers) {
        // Encrypt Password
        var userDetails = {
            email: answers.adminEmail,
            username: answers.adminUsername,
            password: auth.passwordHash(answers.adminPassword),
            group_id: 0
        };
        // Forge User
        User.forge(userDetails).save().then(function() {
            console.log('User Successfully Created.');
            // Initial Site Creation
        }).catch(function(e) {
            console.log('An error occurred when saving the user:');
            console.log(e);
            process.exit(-1);
        });
    });
}

function createNewSite() {
    // Inquirer - Prompt
    return inquirer.prompt([
        {
            type: 'input',
            name: 'primary_domain',
            message: 'Please Enter Your Default Site\'s Primary FQDN ( without URI ): ',
            filter: String
        },
        {
            type: 'textarea',
            name: 'other_domains',
            message: 'Please Enter Your Domain Names For Your Primary Site ( again, without URI - seperated by whitespace ): ',
            filter: String
        },
        {
            type: 'input',
            name: 'title',
            message: 'Please Enter Display Title (publicly visible) for the default site: ',
            filter: String
        }
    ], function(answers) {
        // Encrypt Password
        var siteDetails = {
            primary_domain: answers.primary_domain,
            other_domains: answers.other_domains,
            title: answers.title
        };
        // Forge New Site
        return Site.forge(siteDetails).save().then(function() {
            console.log('Site Successfully Created.');
            // Initial Site Creation
            knex('site').select().orderBy('id').limit(1).then(function(result) {
                // Count Sites
                var site_id = result[0].id;

                // Build some defaults
                var defaultSettings = {
                    site_id: site_id,
                    title: 'Default Page Template',
                    name: 'default_page_template',
                    value: 'default'
                };

                Setting.forge(defaultSettings).save().then(function() {
                    defaultSettings.title = 'Default Particle Template'
                    defaultSettings.name = 'default_particle_template'

                    Setting.forge(defaultSettings).save().then(function() {
                        console.log('Default settings created...');
                    });
                });

                knex('page').select().where({'parent_type': 'site', 'parent_id': site_id}).limit(1).then(function (result) {
                    // Need to create a user?
                    if (result.length == 0) {
                        var pageDetails = {
                            parent_type: "site",
                            parent_id: site_id,
                            position: 2,
                            title: 'Homepage',
                            templateName: 'default',
                            slug: '',
                            metaDescription: 'Another Awesome Site Powered by Cimentarius'
                        };
                        // Forge New Site
                        Page.forge(pageDetails).save().then(function () {
                            console.log('Default Homepage Successfully Created.');
                        }).catch(function (e) {
                            console.log('An error occurred when saving the new Default Homepage:');
                            console.log(e);
                            process.exit(-1);
                        }).lastly(function () {
                            console.log('All done!');
                            process.exit();
                        });
                    } else {
                        // No New Users Required
                        return console.log('Default Homepage Already Exists');
                    }
                });
            });
        }).catch(function(e) {
            console.log('An error occurred when saving the new site:');
            console.log(e);
            process.exit(-1);
        }).lastly(function() {
            return console.log('All done!');
        });
    });


}