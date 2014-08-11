'use strict';
var connect = require('connect'),
    http = require('http')

var cimentarius = connect();

cimentarius.process = function(callback) {
    console.log('listen');
    console.log(callback);
};

module.exports = cimentarius;
