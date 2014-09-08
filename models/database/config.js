'use strict';

var config = require('../../lib/config');
var knex = require('knex');

/**
 * Database Config
 * @returns {{client: string, connection: {host: *, user: *, password: *, database: *, charset: string}}}
 */
module.exports.config = function() {
    return knex({
        client: 'mysql',
        debug: isDevMode(),
        connection: {
            host: config['dbHost'],
            user: config['dbUser'],
            password: config['dbPass'],
            database: config['dbName'],
            charset: 'utf8'
        }
    });
};


/**
 * Check If App Is In Dev Mode
 * @returns {boolean}
 */
function isDevMode()
{
    return config['version'] === 'DEV';
}
