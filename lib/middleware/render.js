"use strict"

var swig  = require('swig');

var render = function(str, options, fn){
    var swig = require('swig'));
    try {
        if(options.cache === true) options.cache = 'memory';
        var tmpl = cache(options) || cache(options, engine.compile(str, options));
        fn(null, tmpl(options));
    } catch (err) {
        fn(err);
    }
};


module.exports = function () {
    return function query(req, res, next) {
        req.query = qs.parse(url.parse(req.url).query);
        next();
    };
};