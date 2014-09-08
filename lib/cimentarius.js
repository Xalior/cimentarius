'use strict';
var config = require('../config/config.js'),
    admin = require('./admin'),
    connect = require('connect'),
    http = require('http'),
    Cookies = require('cookies'),
    qs = require('qs'),
    Page = require('../models/shelves/page.js').Page;

var cimentarius = connect();

cimentarius.process = function(callback) {
    this.use(cimentarius.app);
    http.createServer(this).listen(8080);
};

cimentarius.app = function(req,res) {
    var queryString = req.url.split('?');
        queryString.shift();
    req.locals = {
        hostname: req.headers.host.split(":")[0],
        cookies: new Cookies(req, res),
        queryString: qs.parse(queryString.shift())
    };
    console.log(req.locals);

    cimentarius.router(req,res);
};

cimentarius.router = function(req, res) {
    var requestPath = req.url.split('/');
        requestPath.shift();

    console.log("cimentarius.router: "+req.url);
    var thisRequestPart = requestPath.shift();
    if(thisRequestPart == config.admin)
    {
        admin.router(requestPath, req, res);
        return;
    }
    if(thisRequestPart == 'favicon.ico') {
        res.writeHead(404, 'was never, ever never here...');
        res.end();
    }
    Page.forge({slug: thisRequestPart}).fetch().then(
        function(thisPage) {
            console.log("thisPage:");
            if(thisPage) {
                // we got one!
                console.log(thisPage.attributes.title);

                res.end(thisPage.attributes.title);
            } else {
                console.log('404 on '+thisRequestPart);

                res.end(JSON.stringify(req.url));
            }
        }
    );
    console.log("cimentarius.router: END\n\n");

};

module.exports = cimentarius;