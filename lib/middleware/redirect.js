"use strict"

function middleware(){
    return function redirect(req, res, next) {
        res.redirect = require('response-redirect');
        next();
    };
};

module.exports = middleware;
