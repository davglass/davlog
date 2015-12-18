/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var color = require('ansi-color').set;
var util = require('util');
var Console = require('console').Console;

function DavLog (options) {
    options = options || {};

    this.beSilent = false;
    this.beQuiet = false;

    this.isTTY = process.stdin.isTTY;
    if (options.color === false) {
        this.isTTY = false;
    }

    this.timestamps = options.timestamps;
    this.name = options.name || 'davlog';
    this.pcolor = options.color || 'magenta';
    this.stdout = options.stdout || process.stdout;
    this.stderr = options.stderr || process.stderr;
    var thisConsole = new Console(this.stdout, this.stderr);
    this.logFn = thisConsole.log;
    this.errFn = thisConsole.error;
    this.COLORS = {
        info: 'white',
        log: 'cyan',
        warn: 'yellow',
        error: 'red',
        err: 'red'
    };
    this.STRINGS = {
        info: 'info',
        log: 'log',
        warn: 'warn',
        error: 'error',
        err: 'err'
    };
}

DavLog.prototype.prefix = function(){
    return (this.timestamps ? new Date().toISOString() + ' ' : '' ) + this.color(this.name, this.pcolor);
};

DavLog.prototype.quiet = function () {
    this.beQuiet = true;
};

DavLog.prototype.silent = function () {
    this.beSilent = true;
    this.beQuiet = true;
};

DavLog.prototype.color = function (str, code) {
    if (!this.isTTY) {
        return str;
    }
    return color(str, code);
};

DavLog.prototype.setup = function(type, args) {
    return [
        this.prefix(),
        this.color('[' + this.STRINGS[type] + ']', this.COLORS[type]),
        util.format.apply(null, args)
    ];
};

DavLog.prototype.info = function () {
    if (!this.beQuiet) {
        var args = this.setup('info', arguments);
        this.logFn.apply(null, args);
    }
};


DavLog.prototype.log = function () {
    if (!this.beQuiet) {
        var args = this.setup('log', arguments);
        this.logFn.apply(null, args);
    }
};

DavLog.prototype.warn = function () {
    if (!this.beSilent) {
        var args = this.setup('warn', arguments);
        this.logFn.apply(null, args);
    }
};

DavLog.prototype.error = function () {
    if (!this.beSilent) {
        var args = this.setup('error', arguments);
        this.errFn.apply(null, args);
    }
    process.exit(1);
};

DavLog.prototype.err = function () {
    if (!this.beSilent) {
        var args = this.setup('err', arguments);
        this.errFn.apply(null, args);
    }
};

DavLog.prototype.init = function(options) {
    return new DavLog(options);
};

module.exports = new DavLog();
