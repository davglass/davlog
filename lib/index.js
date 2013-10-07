/*
Copyright (c) 2012, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://yuilibrary.com/license/
*/
var color = require('ansi-color').set;
var hasColor = process.stdin.isTTY;

var quiet;
var silent;

var prefix;

exports.STRINGS = {
    info: 'info',
    log: 'log',
    warn: 'warn',
    error: 'error',
    err: 'err'
};

exports.COLORS = {
    info: 'white',
    log: 'cyan',
    warn: 'yellow',
    error: 'red',
    err: 'red'
};

exports.logFn = console.log;
exports.errFn = console.error;

exports.isTTY = hasColor;

exports.quiet = function () {
    quiet = true;
};

exports.silent = function () {
    silent = true;
    quiet = true;
};

exports.init = function(options) {
    silent = false;
    quiet = false;
    var name = 'davlog',
        pcolor = 'magenta';

    if (options) {
        if (options.color === false) {
            hasColor = false;
        }
        name = options.name || name;
        pcolor = options.color || pcolor;
    }

    prefix = exports.color(name, pcolor);
};

exports.color = function (str, code) {
    if (!hasColor) {
        return str;
    }
    return color(str, code);
};

var setup = function(type, args) {
    args = Array.prototype.slice.call(args);
    args.unshift(exports.color('[' + exports.STRINGS[type] + ']', exports.COLORS[type]));
    args.unshift(prefix);
    return args;
};

exports.info = function () {
    if (!quiet) {
        var args = setup('info', arguments);
        exports.logFn.apply(null, args);
    }
};


exports.log = function () {
    if (!quiet) {
        var args = setup('log', arguments);
        exports.logFn.apply(null, args);
    }
};

exports.warn = function () {
    if (!silent) {
        var args = setup('warn', arguments);
        exports.logFn.apply(null, args);
    }
};

exports.error = function () {
    if (!silent) {
        var args = setup('error', arguments);
        exports.errFn.apply(null, args);
    }
    process.exit(1);
};

exports.err = function () {
    if (!silent) {
        var args = setup('err', arguments);
        exports.errFn.apply(null, args);
    }
};

exports.init();
