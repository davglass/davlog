/*
 * Copyright (c) 2013, Yahoo! Inc. All rights reserved.
 * Copyrights licensed under the New BSD License.
 * See the accompanying LICENSE file for terms.
 */
var setColor = require('ansi-color').set;
var util = require('util');
var PassThrough = require('stream').PassThrough;
var Console = require('console').Console;

function makePassThrough (strm) {
    var passthrough = new PassThrough();
    passthrough.pipe(strm);
    return passthrough;
}

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
    this.stdout = makePassThrough(options.stdout || process.stdout);
    this.stderr = makePassThrough(options.stderr || process.stderr);
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

['logFn', 'errFn'].forEach(function(name){
    var hiddenName = '_' + name;
    Object.defineProperty(DavLog.prototype, name, {
        get: function () {
            return this[hiddenName];
        },
        set: function (fn) {
            this[hiddenName] = fn;
            this.reset();
        }
    });
});

function prefixWithTimestamps () {
    return new Date().toISOString() + ' ' + this.color(this.name, this.pcolor);
}

function prefixNoTimestamps () {
    return this.color(this.name, this.pcolor);
}

DavLog.prototype.quiet = function quiet () {
    this.beQuiet = true;
    this.reset();
};

DavLog.prototype.silent = function silent () {
    this.beSilent = true;
    this.beQuiet = true;
    this.reset();
};

function noop() {}

function noopPass (str) {
    return str;
}

function color (str, code) {
    if (!this.isTTY) {
        return str;
    }
    return setColor(str, code);
}

function makeLogFunction(type, logFn) {
    return function aLogFunction() {
        logFn.apply(this, this.setup(type, arguments));
    };
}

DavLog.prototype.reset = function reset () {
    this.info = this.beQuiet ? noop : makeLogFunction('info', this.logFn).bind(this);
    this.log = this.beQuiet ? noop : makeLogFunction('log', this.logFn).bind(this);
    this.warn = this.beQuiet ? noop : makeLogFunction('warn', this.logFn).bind(this);
    this.err = this.beSilent ? noop : makeLogFunction('err', this.errFn).bind(this);
    this.error = this.beSilent ? process.exit.bind(process, 1) : function errorOut() {
        makeLogFunction('error', this.errFn).apply(this, arguments);
        process.exit(1);
    }.bind(this);
    this.prefix = this.timestamps ? prefixWithTimestamps : prefixNoTimestamps;
    this.color = this.isTTY ? color : noopPass;
};

DavLog.prototype.setup = function setup (type, args) {
    return [
        this.prefix(),
        this.color('[' + this.STRINGS[type] + ']', this.COLORS[type]),
        util.format.apply(null, args)
    ];
};

DavLog.prototype.init = function init (options) {
    return new DavLog(options);
};

module.exports = new DavLog();
