'use strict';
var connect = require('connect'),
    http = require('http')

var cimentarius = connect();

cimentarius.process = function(callback) {
    this.use(cimentarius.router);
    http.createServer(this).listen(8080);
};

cimentarius.router = function(req,res) {
        res.end(JSON.stringify(req.url));
};

module.exports = cimentarius;
