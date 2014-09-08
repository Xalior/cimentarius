'use strict';
var config = require('../config/config.js'),
    admin = require('./admin'),
    connect = require('connect'),
    http = require('http'),
    Cookies = require('cookies'),
    qs = require('qs'),
    Page = require('../models/shelves/page.js').Page;

var cimentarius = connect();
    cimentarius.middlewares = {
        redirect: function(url) {
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

        // Set location header
        this.location(address);
        address = this.get('Location');

        // Support text/{plain,html} by default
        this.format({
            text: function(){
                body = statusCodes[status] + '. Redirecting to ' + encodeURI(url);
            },

            html: function(){
                var u = escapeHtml(url);
                body = '<p>' + statusCodes[status] + '. Redirecting to <a href="' + u + '">' + u + '</a></p>';
            },

            default: function(){
                body = '';
            }
        });

        // Respond
        this.statusCode = status;
        this.set('Content-Length', Buffer.byteLength(body));

        if (this.req.method === 'HEAD') {
            this.end();
        }

        this.end(body);
    }

};

cimentarius.process = function(callback) {
    this.use(cimentarius.app);
    http.createServer(this).listen(8080);
};

cimentarius.app = function(req,res) {
    var queryString = req.url.split('?');
    queryString.shift();

    cimentarius.addMiddleware(req, res);

    cimentarius.router(req, res);
};

cimentarius.addMiddleware(req, res) {
    req.locals = {
        hostname: req.headers.host.split(":")[0],
        cookies: new Cookies(req, res),
        queryString: qs.parse(queryString.shift())
    };


};

cimentarius.router = function(req, res) {
    var requestPath = req.url.split('/');
        requestPath.shift();

    console.log("cimentarius.router: "+req.url);
    var thisRequestPart = requestPath.shift();
    if(thisRequestPart == config.admin)
    {
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