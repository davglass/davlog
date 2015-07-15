/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var color = require('ansi-color').set;
var util = require('util');
var hasColor = process.stdin.isTTY;

var quiet;
var silent;

var prefix;

var timestamps;

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
        timestamps = options.timestamps;
        name = options.name || name;
        pcolor = options.color || pcolor;
    }

    prefix = function(){
        return (timestamps ? new Date().toISOString() + ' ' : '' ) + exports.color(name, pcolor);
    };
};

exports.color = function (str, code) {
    if (!hasColor) {
        return str;
    }
    return color(str, code);
};

var setup = function(type, args) {
    return [
        prefix(),
        exports.color('[' + exports.STRINGS[type] + ']', exports.COLORS[type]),
        util.format.apply(null, args)
    ];
};

exports.setup = setup;

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
