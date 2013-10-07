var vows = require('vows'),
    assert = require('assert'),
    davlog = require('../lib');

var tests = {
    'is loaded': {
        topic: function() {
            return davlog;
        },
        'contains info': function(l) {
            assert.isFunction(l.info);
        },
        'contains warn': function(l) {
            assert.isFunction(l.warn);
        }
    },
    'info': {
        topic: function() {
            var args = null,
                log = function() {
                    args = Array.prototype.slice.call(arguments);
                };

            davlog.logFn = log;
            
            davlog.info('this', 'is', 'a', 'test');
            
            return args;
        },
        'should have 6 items': function(a) {
            assert.equal(a.length, 6);
        },
        'and items are right': function(a) {
            assert.equal(a[0], '\u001b[35mdavlog\u001b[0m');
            assert.equal(a[1], '\u001b[37m[info]\u001b[0m');
            assert.equal(a[2], 'this');
            assert.equal(a[3], 'is');
            assert.equal(a[4], 'a');
            assert.equal(a[5], 'test');
        }
    },
    'warn': {
        topic: function() {
            var args = null,
                log = function() {
                    args = Array.prototype.slice.call(arguments);
                };

            davlog.logFn = log;
            davlog.init({
                name: 'foo'
            });
            
            davlog.warn('this', 'is', 'a', 'test');
            
            return args;
        },
        'should have 6 items': function(a) {
            assert.equal(a.length, 6);
        },
        'and items are right': function(a) {
            assert.equal(a[0], '\u001b[35mfoo\u001b[0m');
            assert.equal(a[1], '\u001b[33m[warn]\u001b[0m');
            assert.equal(a[2], 'this');
            assert.equal(a[3], 'is');
            assert.equal(a[4], 'a');
            assert.equal(a[5], 'test');
        }
    },
    'log': {
        topic: function() {
            var args = null,
                log = function() {
                    args = Array.prototype.slice.call(arguments);
                };

            davlog.logFn = log;
            davlog.init({
                name: 'foo',
                color: 'white'
            });
            
            davlog.log('this', 'is', 'a', 'test');
            
            return args;
        },
        'should have 6 items': function(a) {
            assert.equal(a.length, 6);
        },
        'and items are right': function(a) {
            assert.equal(a[0], '\u001b[37mfoo\u001b[0m');
            assert.equal(a[1], '\u001b[36m[log]\u001b[0m');
            assert.equal(a[2], 'this');
            assert.equal(a[3], 'is');
            assert.equal(a[4], 'a');
            assert.equal(a[5], 'test');
        }
    },
    'err': {
        topic: function() {
            var args = null,
                log = function() {
                    args = Array.prototype.slice.call(arguments);
                };

            davlog.errFn = log;
            davlog.init({
                name: 'foo',
                color: 'white'
            });
            
            davlog.err('this', 'is', 'a', 'test');
            
            return args;
        },
        'should have 6 items': function(a) {
            assert.equal(a.length, 6);
        },
        'and items are right': function(a) {
            assert.equal(a[0], '\u001b[37mfoo\u001b[0m');
            assert.equal(a[1], '\u001b[31m[err]\u001b[0m');
            assert.equal(a[2], 'this');
            assert.equal(a[3], 'is');
            assert.equal(a[4], 'a');
            assert.equal(a[5], 'test');
        }
    },
    'err -- noColor': {
        topic: function() {
            var args = null,
                log = function() {
                    args = Array.prototype.slice.call(arguments);
                };

            davlog.errFn = log;
            davlog.init({
                color: false
            });
            
            davlog.err('this', 'is', 'a', 'test');
            
            return args;
        },
        'should have 6 items': function(a) {
            assert.equal(a.length, 6);
        },
        'and items are right': function(a) {
            assert.equal(a[0], 'davlog');
            assert.equal(a[1], '[err]');
            assert.equal(a[2], 'this');
            assert.equal(a[3], 'is');
            assert.equal(a[4], 'a');
            assert.equal(a[5], 'test');
        }
    },
    'error': {
        topic: function() {
            var args = null,
                exit = process.exit,
                log = function() {
                    args = Array.prototype.slice.call(arguments);
                };

            davlog.errFn = log;
            davlog.init({
                color: false
            });


            process.exit = function() {
                args.push(true);
            };
            
            davlog.error('this', 'is', 'a', 'test');

            process.exit = exit;
            
            return args;
        },
        'should have 7 items': function(a) {
            assert.equal(a.length, 7);
        }
    },
    'info, log & warn - quiet': {
        topic: function() {
            var args = [],
                log = function() {
                    args = [].concat(args, Array.prototype.slice.call(arguments));
                };

            davlog.logFn = log;
            davlog.quiet();

            davlog.info('this', 'is', 'a', 'test');
            davlog.log('this', 'is', 'a', 'test');
            davlog.warn('this', 'is', 'a', 'test');

            return args;
        },
        'should have 6 items': function(a) {
            assert.equal(a.length, 6);
        }
    },
    'info, log, warn, err & error - silent': {
        topic: function() {
            var args = [],
                exit = process.exit,
                log = function() {
                    args = [].concat(args, Array.prototype.slice.call(arguments));
                };

            davlog.logFn = log;
            davlog.silent();

            process.exit = function() {};

            davlog.info('this', 'is', 'a', 'test');
            davlog.log('this', 'is', 'a', 'test');
            davlog.warn('this', 'is', 'a', 'test');
            davlog.err('this', 'is', 'a', 'test');
            davlog.error('this', 'is', 'a', 'test');

            process.exit = exit;

            return args;
        },
        'should have 0 items': function(a) {
            assert.equal(a.length, 0);
        }
    }
};

vows.describe('davlog').addBatch(tests)['export'](module);
