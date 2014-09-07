'use strict';

var CimentariusBookshelf = require('../cimentarius');
var Promise = require('bluebird');
var _ = require('lodash');

var gravatar = require('gravatar');
var crypto = require('crypto');

var User = CimentariusBookshelf.Model.extend({
    tableName: 'user',
    // Constructor Override
    constructor: function () {
        // Call Parent
        CimentariusBookshelf.Model.apply(this, arguments);

        // Post-Destroy Hook For Cleaning Up Pivot Table
        this.on('destroying', function (model) {
            return model.related('stories').fetch().then(function (storyCollection) {
                return Promise.all(storyCollection.map(function (storyModel) {
                    return storyModel.destroy();
                }));
            });
        });
    },
    stories: function () {
        return this.hasMany('Stories');
    },
    particles: function () {
        return this.hasMany('Particles');
    },
    particlesNoAnnotations: function () {
        return this.hasMany('Particles').query(function (qb) {
            // Left Join
            qb.join('particle_particle', 'particle.id', '=', 'particle_particle.particle_id', 'left');
            // And Where Join Col is Null
            qb.whereNull('particle_particle.particle_id');
        });
    },
    /**
     * Get Avatar Url
     * Either Gravatar or Image From File System
     * @param width
     * @returns {string}
     */
    getAvatarUrl: function (width) {
        // Check Gravatar
        if (this.get('use_gravatar')) {
            return gravatar.url(this.get('email'), {s: width, r: 'g', d: 'mm'});
        } else {
            // Check URL Field
            if (this.get('avatar_image_url') === null || this.get('avatar_image_url') === '') {
                // Return Placeholder
                return '/img/user-ph.jpg';
            }
            // Return It
            return this.get('avatar_image_url');
        }
    },
    /**
     * Generate a Password Reset Token, Save to DB
     */
    generatePasswordResetToken: function () {
        // Generate Token
        var token = crypto.randomBytes(8).toString('hex');
        // Set on Model
        this.set('password_reset_token', token);
        // Save
        return this.save().then(function () {
            return token;
        });
    },
    /**
     * Generate Activation Token
     * @returns User
     */
    generateActivationToken: function () {
        // Generate Token
        var token = crypto.randomBytes(8).toString('hex');
        // Set
        this.set('activation_token', token);
        // Return This For Chaining
        return this;
    },
    /**
     * Get Activation Token
     * @returns {*}
     */
    getActivationToken: function () {
        return this.get('activation_token');
    }
});

var Users = CimentariusBookshelf.Collection.extend({
    model: User
});

module.exports = {
    User: CimentariusBookshelf.model('User', User),
    Users: CimentariusBookshelf.collection('Users', Users)
};