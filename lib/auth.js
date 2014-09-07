'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passwordHash = require('password-hash'),
    config = require('../config/config'),
    User = require('../models/shelves/admin/user').User;

module.exports.admin = {};

module.exports.admin.authenticate = function(req, res, next) {
    // Success
//    var successUrl = '/admin';
    // Fail
//    var failUrl = '/admin/login';

    var redirectPrefix = req.url.startsWith('/admin') ? '/admin/' : '/';

    passport.authenticate('local', {
        successRedirect: req.session.goingTo || redirectPrefix,
        failureRedirect: redirectPrefix + 'login',
        failureFlash: true
    })(req, res, next);
};


/**
 * Cimentarius Passport Auth Strategy
 * @returns {LocalStrategy}
 */
module.exports.localStrategy = function() {
    return new LocalStrategy({passReqToCallback: true}, function(req, username, password, done) {
            User.forge().set({username: username}).fetch().then(function(user) {
                // Only Allow Login If Activation Token Has Been Nullified
                if (user && !user.getActivationToken() && module.exports.passwordVerify(user.attributes.password, password)) {
                    user.set({last_seen: new Date()});
                    user.save().then(function(user) {
                        done(null, user);
                    }).catch(function(e) {
                        // Log
                        console.log(e);
                        // Done
                        done('There was an error logging in.');
                    });
                } else {
                    done(null, false, { message: 'Incorrect Username or Password.' });
                }
            }).catch(function(e) {
                done(e);
            });
        }
    );
};

module.exports.passwordHash = function(password) {
    return passwordHash.generate(config.salt + password);
};

module.exports.passwordVerify = function(hash, password) {
    return passwordHash.verify(config.salt+ password, hash)
};

/**
 * Inject the User Data in res.locals
 * @param req
 * @param res
 */
module.exports.injectUser = function(req, res, next) {
    if (req.user) {
        res.user.username = req.user.get('username');
        res.locals.currentUser = req.user;
    }
};