"use strict"

var url = require('url'),
    qs = require('qs');

function middleware() {
    return function query(req, res, next) {
        req.query = qs.parse(url.parse(req.url).query);
        next();
    };
};

module.exports = middleware();