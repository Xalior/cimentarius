"use strict"


// inspiration: https://github.com/expressjs/connect-render/blob/master/lib/render.js

var path = require('path'),
    swig  = require('swig'),
    cimentarius;

var settings = {
    root: __dirname + '../../../views',
    cache: true,
    templatePack: 'default'
};

var cache = {};

function _render(view, options, fn, templatePack, viewMode) {
    templatePack = templatePack || 'default';
    templatePack = templatePack+'/';

    viewMode = viewMode || 'public';
    viewMode = viewMode+'/';

    var viewpath = path.resolve(settings.root+'/'+viewMode+templatePack+'/'+view);

    var tpl = settings.cache && cache[view];
    if (!tpl) {
        cimentarius.console.info('cimentarius::lib/middleware/render::_render: cache miss for '+viewpath);
        tpl = swig.compileFile(viewpath);

        if (settings.cache) {
            cache[viewpath] = tpl;
        }
    }
    fn(tpl(options));
}

function send(res, str) {
    var buf = new Buffer(str);
    res.charset = res.charset || 'utf-8';
    var contentType = res.getHeader('Content-Type') || 'text/html';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buf.length);
    res.end(buf);
}

function render(view, options, fn, templatePack, viewMode) {
    var that = this;

    options = options || {};

    fn = fn || function(data, err) {
        if(err) {
            send(that, render('err/500.swig', {err: err}))
        } else {
            send(that, data)
        }
    };

    _render(view, options, fn, templatePack, viewMode);

}

function renderAdmin(view, options, templatePack) {
    var that = this;
    var fn = function(data, err) {
        if(err) {
            send(that, render('err/500.swig', {err: err}))
        } else {
            send(that, data)
        }
    }

    _render(view, options, fn, templatePack, 'admin');
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

    console.log(settings);
    return function (req, res, next) {
        req.next = next;
        if (!res.req)
            res.req = req;
        res.renderAdmin = renderAdmin;
        res.render = render;
        next();
    };
}

module.exports = middleware;