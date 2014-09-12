'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passwordHash = require('password-hash'),
    config = require('../../config/config'),
    User = require('../../models/shelves/admin/user').User;

var auth = {
    admin: {
        authenticate: function (req, res) {
            console.log("vv");
            console.log(next);
            console.log("^^");
            var redirectPrefix = req.url.startsWith('/' + config.admin) ? '/' + config.admin + '/' : '/';

            var authDone = function(err, user, messages) {
                console.log('auth done');
                console.log(messages)
                console.log(user);
            }

            passport.authenticate('local', {
                successRedirect: req.session.goingTo || redirectPrefix,
                failureRedirect: redirectPrefix + 'login',
                failureFlash: true
            })(req, res, authDone);
        }
    },

    /**
     * Cimentarius Passport Auth Strategy
     * @returns {LocalStrategy}
     */
    localStrategy: function () {
        return new LocalStrategy({passReqToCallback: true}, function (req, username, password, done) {
                User.forge().set({username: username}).fetch().then(function (user) {
                    // Only Allow Login If Activation Token Has Been Nullified
                    if (user && !user.getActivationToken() && module.exports.passwordVerify(user.attributes.password, password)) {
                        user.set({last_seen: new Date()});
                        user.save().then(function (user) {
                            done(null, user);
                        }).catch(function (e) {
                            // Log
                            console.log(e);
                            // Done
                            done('There was an error logging in.');
                        });
                    } else {
                        done(null, false, {message: 'Incorrect Username or Password.'});
                    }
                }).catch(function (e) {
                    done(e);
                });
            }
        );
    },

    passwordHash: function (password) {
        return passwordHash.generate(config.salt + password);
    },

    passwordVerify: function (hash, password) {
        return passwordHash.verify(config.salt + password, hash)
    },

    injectUser: function (req, res) {
        if (req.user) {
            res.user.username = req.user.get('username');
            res.locals.currentUser = req.user;
        }
    },

    router: function(requestPath, req, res) {
        console.log("admin.auth.router:");
        res.renderAdmin('login.swig');
    }
}

module.exports = auth;