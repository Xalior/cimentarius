'use strict';

var LocalStrategy = require('passport-local').Strategy,
    passwordHash = require('password-hash'),
    config = require('../../config/config'),
    User = require('../../models/shelves/admin/user').User;

var auth = {
    passport: null,
    init: function(passport) {
        auth.passport = passport;
        auth.passport.serializeUser(function(user, done) {
            console.log('auth.passport.serializeUser');
            done(null, user.id);
        });

        auth.passport.deserializeUser(function(id, done) {
            console.log('auth.passport.deserializeUser');
            new User().set({id: id}).fetch().then(function(user) {
                done(null, user);
            }).catch(function(e) {
                done(e, null);
            });
        });

        auth.passport.use('admin-login', new LocalStrategy({passReqToCallback: true}, function (req, username, password, done) {
                console.log('LocalStrategy:admin-signup');
                User.forge().set({username: username}).fetch().then(function (user) {
                    // Only Allow Login If Activation Token Has Been Nullified
                    console.log(user);
                    if (user && !user.getActivationToken() && auth.passwordVerify(user.attributes.password, password)) {
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
            })
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
        if (typeof(auth.routes[requestPath])=='function') {
            auth.routes[requestPath](requestPath, req, res)
        } else {
            console.log(requestPath);
        }
    },

    routes: {
        login: function(requestPath, req, res) {
            res.locals._adminLogin = '/'+config.admin+'/auth/login';
            if(req.method.toUpperCase()=='GET') {
                res.renderAdmin('login.swig');
            } else {
                console.log("ADMIN:/auth/login::NOTGET::");

                var authDone = function(err, user, messages) {
                    console.log('auth done');
                    console.log(messages)
                    console.log(user);
                }

                auth.passport.authenticate('admin-login', {
                    successRedirect: req.session.goingTo || '/'+config.admin+'/dashboard',
                    failureRedirect: res.locals._adminLogin,
                    failureFlash: true
                })(req, res, authDone);
            }
        }
    }
}

module.exports = auth;