"use strict"

// Flash Types and BootStrap Mappings
var flashTypes = {error: 'danger', warning: 'warning', info: 'info', success: 'success'};

function middleware(){
    return function (req, res, next) {
        // Get Flash
        var flash = req.flash();
        var flashItems = [];
        var flashMessages = [];
        // Iterate
        for (var key in flashTypes) {
            if (flashTypes.hasOwnProperty(key) && flash.hasOwnProperty(key)) {
                for (var message in flash[key]) {
                    if (flash[key].hasOwnProperty(message)) {
                        flashItems.push('<div class="alert alert-' + flashTypes[key] + '">' + flash[key][message] + '</div>');
                        flashMessages.push({
                            type: flashTypes[key],
                            msg: flash[key][message]
                        })
                    }
                }
            }
        }
        // Items to Render?
        if (flashItems.length) {
            res.locals._messageHtml = flashItems.join('\n');
            res.locals._messages = JSON.stringify(flashMessages);
        }
        next();
    };
};

module.exports = middleware;
