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
        'should have 3 items': function(a) {
            assert.equal(a.length, 3);
        },
        'and items are right': function(a) {
            assert.equal(a[0], '\u001b[35mdavlog\u001b[0m');
            assert.equal(a[1], '\u001b[37m[info]\u001b[0m');
            assert.equal(a[2], 'this is a test');
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
        'should have 3 items': function(a) {
            assert.equal(a.length, 3);
        },
        'and items are right': function(a) {
            assert.equal(a[0], '\u001b[35mfoo\u001b[0m');
            assert.equal(a[1], '\u001b[33m[warn]\u001b[0m');
            assert.equal(a[2], 'this is a test');
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
        'should have 3 items': function(a) {
            assert.equal(a.length, 3);
        },
        'and items are right': function(a) {
            assert.equal(a[0], '\u001b[37mfoo\u001b[0m');
            assert.equal(a[1], '\u001b[36m[log]\u001b[0m');
            assert.equal(a[2], 'this is a test');
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
        'should have 3 items': function(a) {
            assert.equal(a.length, 3);
        },
        'and items are right': function(a) {
            assert.equal(a[0], '\u001b[37mfoo\u001b[0m');
            assert.equal(a[1], '\u001b[31m[err]\u001b[0m');
            assert.equal(a[2], 'this is a test');
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
        'should have 3 items': function(a) {
            assert.equal(a.length, 3);
        },
        'and items are right': function(a) {
            assert.equal(a[0], 'davlog');
            assert.equal(a[1], '[err]');
            assert.equal(a[2], 'this is a test');
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
        'should have 4 items': function(a) {
            assert.equal(a.length, 4);
        }
    },
    'info, log, warn, err & error formatting/substitution': {
        topic: function() {
            var args = [],
                exit = process.exit,
                log = function() {
                    args.push(Array.prototype.slice.call(arguments));
                };

            davlog.logFn = log;
            davlog.errFn = log;

            process.exit = function() {};

            davlog.info('%s %s %s %s', 'this', 'is', 'a', 'test');
            davlog.log('%s %s %s %s', 'this', 'is', 'a', 'test');
            davlog.warn('%s %s %s %s', 'this', 'is', 'a', 'test');
            davlog.err('%s %s %s %s','this', 'is', 'a', 'test');
            davlog.error('%s %s %s %s','this', 'is', 'a', 'test');

            process.exit = exit;

            return args;
        },
        'should have correctly formatted output': function(a) {
            assert.deepEqual(a, [
                ['davlog', '[info]', 'this is a test'],
                ['davlog', '[log]', 'this is a test'],
                ['davlog', '[warn]', 'this is a test'],
                ['davlog', '[err]', 'this is a test'],
                ['davlog', '[error]', 'this is a test']
            ]);
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
        'should have 3 items': function(a) {
            assert.equal(a.length, 3);
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
    },
    'timestamps': {
        topic: function() {
            var args = null,
                log = function() {
                    args = Array.prototype.slice.call(arguments);
                },
                oldToISO = Date.prototype.toISOString;

            davlog.logFn = log;
            davlog.init({
                timestamps: true
            });

            Date.prototype.toISOString = function(){
                return 'FAKE_ISO_STRING';
            };
            
            davlog.log('this is a test');
            
            Date.prototype.toISOString = oldToISO;
            return args;
        },
        'should have 3 items': function(a) {
            assert.equal(a.length, 3);
        },
        'and the items are right': function(a) {
            assert.equal(a[0], 'FAKE_ISO_STRING davlog');
            assert.equal(a[1], '[log]');
            assert.equal(a[2], 'this is a test');
        }
    }
};

vows.describe('davlog').addBatch(tests)['export'](module);
