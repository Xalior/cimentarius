'use strict';
var config = require('../lib/config.js'),
    admin = require('../controllers/admin/index'),
    connect = require('connect'),
    http = require('http'),
    bodyParser = require('body-parser'),
    cookies = require('cookies').connect([config.salt]),
    session = require('cookie-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    serveStatic = require('serve-static'),
    url = require('url'),
    Page = require('../models/shelves/page.js').Page;

var cimentarius = connect();

cimentarius.console = require('./helpers/console');

cimentarius.middlewares = {
    bootstrap: function bootstrap() {
        this.cimentarius = cimentarius;
        return function(req, res, next) {
            req.cimentarius = cimentarius;
            res.req = res;
            res.locals = {};
            next();
        }
    },
    query: require('./middleware/query'),
    redirect: require('./middleware/redirect'),
    render: require('./middleware/render'),
    flash: require('./middleware/flash'),
};

cimentarius.main = function(callback) {
    // add middleware

    // req.cookies
    this.use(cookies);
    this.use(session({
        secret: config.salt,
        name: 'cimentarius'
    }));

// Passport

    this.use(passport.initialize());
    this.use(passport.session());
    admin.auth.init(passport);
    this.use(bodyParser.json());
    this.use(bodyParser.urlencoded({
        extended: true
    }));
    this.use(flash());
    cimentarius.init();
    this.use(serveStatic('public', {'index': ['default.html']}));
    this.use(cimentarius.router);
    http.createServer(cimentarius).listen(config.listen_port);
};

cimentarius.init = function init() {
    for (var middleware in cimentarius.middlewares) {
        if(cimentarius.middlewares.hasOwnProperty(middleware)){
            if(typeof cimentarius.middlewares[middleware]=='function') {
                cimentarius.console.debug("loading middleware "+middleware+" with "+JSON.stringify(config.middlewares[middleware])+" config file settings.");
                var payload = cimentarius.middlewares[middleware](config.middlewares[middleware]);
                if(typeof payload=='function') {
                    cimentarius.use(payload);
                }
            } else {
                console.log('unknown middleware');
            }
        }
    }
    admin.auth.init(passport);
    console.log('cimentarius.init done :)');
};

cimentarius.router = function router(req, res, next) {
    var requestPath = req.url.split('/');
        requestPath.shift();

    console.log("cimentarius.router: "+req.url);
    var thisRequestPart = requestPath.shift();
    if(thisRequestPart == config.admin)
    {
        admin.app(requestPath, req, res);
        return;
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