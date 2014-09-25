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
            console.log('LocalStrategy:admin-login');
            User.forge().set({username: username}).fetch().then(function (user) {
                // Only Allow Login If Activation Token Has Been Nullified
                if (user && !user.getActivationToken() && auth.passwordVerify(user.attributes.password, password)) {
                    user.set({last_seen: new Date()});
                    user.save().then(function (user) {
                        done(null, user, null);
                    }).catch(function (e) {
                        // Log
                        console.log(e);
                        // Done
                        done('There was an error logging in.', null, null);
                    });
                } else {
                    console.log('Incorrect');

                    done(null, false, {message: 'Incorrect Username or Password.'});
                }
            }).catch(function (e) {

                console.log('catch');

                done(e, null, null);
            });
        }));

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
        if (typeof(auth.routes[requestPath])=='function') {
            auth.routes[requestPath](requestPath, req, res)
        } else {
            console.log(requestPath);
        }
    },

    routes: {
        login: function(requestPath, req, res) {
            if(req.method.toUpperCase()=='GET') {
                res.renderAdmin('login.swig');
            } else {

                var verified = function(err, user, info) {
                    if (err) {
                        console.log(err);
                        return res.send(err);
                    }
                    if (!user) {
                        req.flash('error', info.message);
                        return res.redirect('/' + config.admin + '/auth/login');
                    }

                    req.flash('info', 'Login successful: ' + user.get('username'));

                    console.log(res.locals);
                    console.log(JSON.stringify(req.session));

                    var options =
                        successReturnToOrRedirect: true
                    };{

                    req.logIn(user, {
                            successReturnToOrRedirect: true
                        }, function (err) {
                            if (err) {
                                return console.log(err);
                            }

                            function complete() {
                                if (options.successReturnToOrRedirect) {
                                    var url = options.successReturnToOrRedirect;
                                    if (req.session && req.session.goingTo) {
                                        url = req.session.goingTo;
                                        delete req.session.goingTo;
                                    }
                                    return res.redirect(url);
                                }
                                if (options.successRedirect) {
                                    return res.redirect(config.admin + '/dashboard');
                                }
                            }

                            if (options.authInfo !== false) {
                                auth.passport.transformAuthInfo(info, req, function (err, tinfo) {
                                    if (err) {
                                        return next(err);
                                    }
                                    req.authInfo = tinfo;
                                    complete();
                                });
                            } else {
                                complete();
                            }
                        }
                    );
                };

                auth.passport.authenticate('admin-login', verified)(req, res, null); // no next
            }
        },
        logout: function(requestPath, req, res) {
            req.logout();
            req.flash('info', 'You have been logged out of Cimentarius.');
            res.redirect('/'+config.admin+'/auth/login')

        }
    }
}

module.exports = auth;
