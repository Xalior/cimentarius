/**
 * Created by darran on 06/09/14.
 */
'use strict';

var admin = {
    router: function(requestPath, req, res) {
        console.info('cimentarius.admin.router: '+JSON.stringify(requestPath));

        console.log(req.headers);

        console.log(req.cookies);

        res.end(JSON.stringify(requestPath));
    }
};

module.exports = admin;