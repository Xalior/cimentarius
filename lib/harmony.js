"use strict";

/*
 * A series of helpers from Javascipt.next -- Safely implimented to shim older versions of webkit - already in
 * seamonkey and V8.harmony :)
 */

// String helpers...
if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
        return this.slice(0, str.length) == str;
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str){
        return this.slice(-str.length) == str;
    };
}

if (typeof String.prototype.contains != 'function') {
    String.prototype.contains = function(s) {
        return this.indexOf(s) !== -1;
    };
}