'use strict';
var config = require('../lib/config.js'),
    admin = require('../controllers/admin/index'),
    connect = require('connect'),
    http = require('http'),
    cookies = require('cookies').connect([config.salt]),
    session = require('cookie-session'),
    qs = require('qs'),
    url = require('url'),
    Page = require('../models/shelves/page.js').Page;

var cimentarius = connect();

cimentarius.middlewares = {
    bootstrap: function bootstrap() {
        return function(req, res, next) {
            req.cimentarius = cimentarius;
            next();
        }
    },
    query: require('./middleware/query'),
    redirect: require('./middleware/redirect'),
    render: require('./middleware/render')
};

cimentarius.main = function(callback) {
    // add middleware

    // req.cookies
    this.use(cookies);
    this.use(session({
        secret: config.salt,
        name: 'cimentarius'
    }));
    this.use(admin.passport.initialize());
    this.use(admin.passport.session());
    cimentarius.init();
    this.use(cimentarius.router);
    http.createServer(cimentarius).listen(config.listen_port);
};

cimentarius.init = function init() {
    for (var middleware in cimentarius.middlewares) {
        if(cimentarius.middlewares.hasOwnProperty(middleware)){
            if(typeof cimentarius.middlewares[middleware]=='function') {
                console.log("loading middleware "+middleware);
                var payload = cimentarius.middlewares[middleware]();
                if(typeof payload=='function') {
                    cimentarius.use(payload);
                }
            } else {
                console.log('unknown middleware');
            }
        }
    }
    console.log('cimentarius.init done :)');
};

cimentarius.router = function router(req, res) {
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

                res.render('index.swig', { title: thisPage.attributes.title });
            } else {
                console.log('404 on '+thisRequestPart);

                res.end(JSON.stringify(req.url));
            }
        }
    );
    console.log("cimentarius.router: defaultEND\n\n");

};

module.exports = cimentarius;