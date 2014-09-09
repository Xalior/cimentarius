'use strict';
var config = require('../config/config.js'),
    admin = require('./admin'),
    connect = require('connect'),
    http = require('http'),
    Cookies = require('cookies'),
    qs = require('qs'),
    Page = require('../models/shelves/page.js').Page;

var cimentarius = connect();

cimentarius.middlewares = {};
cimentarius.helpers = {
    redirect: function(url) {
        console.log("url: "+url);
        var address = url;
        var body;
        var status = 302;

        // allow status / url
        if (arguments.length === 2) {
            if (typeof arguments[0] === 'number') {
                status = arguments[0];
                address = arguments[1];
            } else {
                deprecate('res.redirect(ur, status): Use res.redirect(status, url) instead');
                status = arguments[1];
            }
        }

        console.log("redirecting to "+address);
        this.writeHead(status, {
            'Location': address
        });
        this.end();
    }
};

cimentarius.process = function(callback) {
    this.use(cimentarius.app);
    http.createServer(this).listen(8080);
};

cimentarius.app = function(req,res) {
    cimentarius.init(req, res);

    cimentarius.router(req, res);
};

cimentarius.init = function(req, res) {
    var queryString = req.url.split('?');
    queryString.shift();

    // request middlewares
    req.locals = {
        hostname: req.headers.host.split(":")[0],
        cookies: new Cookies(req, res),
        queryString: qs.parse(queryString.shift())
    };
    // req helpers
    for (var middleware in this.middlewares) {
        if(this.middlewares.hasOwnProperty(middleware)){
            if(typeof this.middlewares[middleware]=='function') {
                console.log("loading middleware "+middleware);
                req[middleware] = this.middlewares[middleware];
            } else {
                console.log('unknown middleware');
            }
        }
    }
    // response helpers
    for (var helper in this.helpers) {
        if(this.helpers.hasOwnProperty(helper)){
            if(typeof this.helpers[helper]=='function') {
                console.log("loading helper "+helper);
                res[helper] = this.helpers[helper];
            } else {
                console.log('unknown helper');
            }
        }
    }
    console.log('init done :)');
};

cimentarius.router = function(req, res) {
    var requestPath = req.url.split('/');
        requestPath.shift();

    console.log("cimentarius.router: "+req.url);
    var thisRequestPart = requestPath.shift();
    if(thisRequestPart == config.admin)
    {
        console.log('request path to pass to admin');
        console.log(requestPath);
        admin.app(requestPath, req, res);
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