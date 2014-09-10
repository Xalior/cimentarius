"use strict"

module.exports = function () {
    return function redirect(req, res, next) {
        res.redirect = require('response-redirect');
        next();
    };
};
