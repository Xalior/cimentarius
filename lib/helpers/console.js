"use strict"

var helper = {
    log: function() {
        console.log(arguments[0]);
    },
    warn: function() {
        console.warn(arguments[0]);
    },
    error: function() {
        console.error(arguments[0]);
    },
    info: function() {
        console.info(__dirname+': '+arguments[0]);
    },
    debug: function() {
        console.info(__dirname+': '+arguments[0]);
    }
};

module.exports = helper;