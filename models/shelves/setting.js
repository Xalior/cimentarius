'use strict';

var CimentariusBookshelf = require('./cimentarius');
var Promise = require('bluebird');
var _ = require('lodash');

var Setting = CimentariusBookshelf.Model.extend(
    // Instance Methods
    {
        tableName: 'setting',
        particles: function () {
            return this.hasMany('Pages');
        },
        // Initialize
        initialize: function () {
            // Destroying Hook for Removing Category Entries In The Through Table
            this.on('destroying', function () {
                console.log('destroying');
                console.log(this);
            });
        }
    }
);

var Settings = CimentariusBookshelf.Collection.extend({
    model: Setting
});

module.exports = {
    model: CimentariusBookshelf.model('Setting', Setting),
    collection: CimentariusBookshelf.collection('Settings', Settings)
//    Form: pageForm
};