"use strict"


// inspiration: https://github.com/expressjs/connect-render/blob/master/lib/render.js

var path = require('path'),
    swig  = require('swig'),
    _ = require('lodash'),
    config = require('../../config/config'),
    adminSwig = new swig.Swig({varControls: ['{~', '~}'], cache: false}),
    cimentarius;

var settings = {
    root: config.getInstallPath() + '/views',
    cache: true,
    templatePack: 'default'
};

swig.setDefaults({ cache: false });         // or the frontend,
var cache = {};                             // and use our own for frontend...

function _render(res, view, options, fn, templatePack, viewMode) {
    var _opts = res.locals;
    var thisSwig;

    _.assign(_opts, options);

    templatePack = templatePack || 'default';

    if(viewMode=='admin') {
        _opts._adminSkin = templatePack;
        _opts._adminRoot = '/' + config.admin;
        thisSwig = adminSwig;
    }
    templatePack = templatePack+'/';

    viewMode = viewMode || 'public';
    viewMode = viewMode+'/';

    var viewpath = path.resolve(settings.root+'/'+viewMode+templatePack+'/'+view);

    var tpl = settings.cache && cache[viewpath];
    if (!tpl) {
        tpl = thisSwig.compileFile(viewpath);

        if (settings.cache) {
            cimentarius.console.info('cimentarius::lib/middleware/render::_render: cache miss for '+viewpath);
            cache[viewpath] = tpl;
        }
    }

    return fn(tpl(_opts));
}

function send(res, str, code) {
    if(code==undefined) code=200;
    res.statusCode = code;
    var buf = new Buffer(str);
    res.charset = res.charset || 'utf-8';
    var contentType = res.getHeader('Content-Type') || 'text/html';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buf.length);
    res.end(buf);
}

function render(view, options, fn, templatePack, viewMode) {
    var res = this;

    options = options || {};

    fn = fn || function(data, err) {
        if(err) {
            send(res, render('err/500.swig', {err: err}))
        } else {
            send(res, data)
        }
    };

    _render(res, view, options, fn, templatePack, viewMode);
}

function renderAdmin(view, options, templatePack, fn) {
    if(!templatePack)
        templatePack = config.adminTemplatePack;
    var res = this;
    if(!fn) fn = function(data, err) {
        if(err) {
            send(res, render('err/500.swig', {err: err}), 500);
        } else {
            send(res, data);
        }
    };

    _render(res, view, options, fn, templatePack, 'admin');
}


function errorAdmin(code, msg, templatePack) {
    var res = this;
    var fn = function(data, err) {
        if(err) {
            send(res, render('err/500.swig', {err: err}), 500);
        } else {
            send(res, data, code);
        }
    };

    _render(res, 'err/'+code+'.swig', {err: msg}, fn, templatePack, 'admin');
}

/**
 * res.render('index.html', { title: 'Index Page', items: items });
 *
 * @return {Function} render middleware for `connect`
 */
function middleware(options) {
    cimentarius = this.cimentarius;
    options = options || {};
    for (var k in options) {
        settings[k] = options[k];
    }

    return function (req, res, next) {
        req.next = next;
        if (!res.req)
            res.req = req;
        res.renderAdmin = renderAdmin;
        res.render = render;
        res.errorAdmin = errorAdmin;
        res._render = _render;
        next();
    };
}

module.exports = middleware;