"use strict"


// inspiration: https://github.com/expressjs/connect-render/blob/master/lib/render.js

var fs = require('fs'),
    path = require('path'),
    http = require('http'),
    swig  = require('swig');

var settings = {
    root: __dirname + '../../views',
    cache: true,
    templatePack: 'default'
};

var cache = {};

function _render(view, options, fn, viewMode) {
    fn(path.resolve(settings.root+'/'+viewMode+view));
    //
    //if (settings.viewExt) {
    //    view += settings.viewExt;
    //}
    //var viewpath = path.join(settings.root, view);
    //var fn = settings.cache && cache[view];
    //if (fn) {
    //    return _render_tpl(fn, options, callback);
    //}
    //// read template data from view file
    //fs.readFile(viewpath, 'utf8', function (err, data) {
    //    if (err) {
    //        return callback(err);
    //    }
    //    var tpl = partial(data);
    //    // fn = ejs.compile(tpl, {filename: viewpath, compileDebug: true, debug: true, _with: settings._with});
    //    fn = ejs.compile(tpl, {
    //        filename: viewpath,
    //        _with: settings._with,
    //        open: settings.open,
    //        close: settings.close
    //    });
    //    if (settings.cache) {
    //        cache[view] = fn;
    //    }
    //    _render_tpl(fn, options, callback);
    //});
}

function send(res, str) {
    var buf = new Buffer(str);
    res.charset = res.charset || 'utf-8';
    var contentType = res.getHeader('Content-Type') || 'text/html';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buf.length);
    res.end(buf);
}

function render(view, options, fn, viewMode) {
    var that = this;
    viewMode = viewMode || 'public';
    viewMode = viewMode+'/';

    options = options || {};

    fn = fn || function(data, err) {
        if(err) {
            send(that, render('err/500.swig', {err: err}))
        } else {
            send(that, data)
        }
    }

    _render(view, options, fn, viewMode);

}

function renderAdmin(view, options) {
    var that = this;
    var fn = function(data, err) {
        if(err) {
            send(that, render('err/500.swig', {err: err}))
        } else {
            send(that, data)
        }
    }

    _render(view, options, fn, 'admin/');
}

/**
 * res.render('index.html', { title: 'Index Page', items: items });
 *
 * @return {Function} render middleware for `connect`
 */
function middleware(options) {
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
        next();
    };
}

module.exports = middleware;