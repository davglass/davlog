var vows = require('vows'),
    assert = require('assert'),
    davlog = require('../lib');

// need to set max listeners because we're piping to stdout and stderr a lot
var MAX_LISTENERS = 15;
process.stdout.setMaxListeners(MAX_LISTENERS);
process.stderr.setMaxListeners(MAX_LISTENERS);

var tests = {
    'is loaded': {
        topic: function() {
            return davlog.init();
        },
        'contains info': function(l) {
            assert.isFunction(l.info);
        },
        'contains warn': function(l) {
            assert.isFunction(l.warn);
        }
    },
    'streams': {
        topic: function() {
            return davlog.init();
        },
        'should have the streams readable': function(l) {
            assert(l.stdout.readable);
            assert(l.stderr.readable);
        }
    },
    'info': {
        topic: function() {
            var args = null,
                log = function() {
                    args = Array.prototype.slice.call(arguments);
                },
                logger = davlog.init();

            logger.logFn = log;
            
            logger.info('this', 'is', 'a', 'test');
            
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
                },
                logger = davlog.init({
                    name: 'foo'
                });

            logger.logFn = log;
            
            logger.warn('this', 'is', 'a', 'test');
            
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
                },
                logger = davlog.init({
                    name: 'foo',
                    color: 'white'
                });

            logger.logFn = log;
            
            logger.log('this', 'is', 'a', 'test');
            
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
                },
                logger = davlog.init({
                    name: 'foo',
                    color: 'white'
                });

            logger.errFn = log;
            
            logger.err('this', 'is', 'a', 'test');
            
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
                },
                logger = davlog.init({
                    color: false
                });

            logger.errFn = log;
            
            logger.err('this', 'is', 'a', 'test');
            
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
                },
                logger = davlog.init({
                    color: false
                });

            logger.errFn = log;


            process.exit = function() {
                args.push(true);
            };
            
            logger.error('this', 'is', 'a', 'test');

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
                },
                logger = davlog.init({color: false});

            logger.logFn = log;
            logger.errFn = log;

            process.exit = function() {};

            logger.info('%s %s %s %s', 'this', 'is', 'a', 'test');
            logger.log('%s %s %s %s', 'this', 'is', 'a', 'test');
            logger.warn('%s %s %s %s', 'this', 'is', 'a', 'test');
            logger.err('%s %s %s %s','this', 'is', 'a', 'test');
            logger.error('%s %s %s %s','this', 'is', 'a', 'test');

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
                },
                logger = davlog.init();

            logger.logFn = log;
            logger.quiet(); // implicit reset

            logger.info('this', 'is', 'a', 'test');
            logger.log('this', 'is', 'a', 'test');
            logger.warn('this', 'is', 'a', 'test');

            return args;
        },
        'should have 0 items': function(a) {
            assert.equal(a.length, 0);
        }
    },
    'info, log, warn, err & error - silent': {
        topic: function() {
            var args = [],
                exit = process.exit,
                log = function() {
                    args = [].concat(args, Array.prototype.slice.call(arguments));
                },
                logger = davlog.init();

            logger.logFn = log;
            process.exit = function() {};
            logger.silent(); // implicit reset


            logger.info('this', 'is', 'a', 'test');
            logger.log('this', 'is', 'a', 'test');
            logger.warn('this', 'is', 'a', 'test');
            logger.err('this', 'is', 'a', 'test');
            logger.error('this', 'is', 'a', 'test');

            process.exit = exit;

            return args;
        },
        'should have 0 items': function(a) {
            assert.equal(a.length, 0);
        }
    },
    'binding' : {
        topic: function() {
            var args = [],
                exit = process.exit,
                log = function() {
                    args.push(this);
                },
                bound,
                logger = davlog.init();

            logger.logFn = log;
            logger.errFn = log;
            process.exit = function() {};
            logger.reset();


            bound = logger.info;
            bound('this', 'is', 'a', 'test');
            bound = logger.log;
            bound('this', 'is', 'a', 'test');
            bound = logger.warn;
            bound('this', 'is', 'a', 'test');
            bound = logger.err;
            bound('this', 'is', 'a', 'test');
            bound = logger.error;
            bound('this', 'is', 'a', 'test');

            process.exit = exit;

            return [args, logger];
        },
        'should be the logger object': function(a) {
            var args = a[0], logger = a[1], i;
            assert.equal(args.length, 5);
            for (i = 0; i < 5; i++) {
                assert.equal(args[i], logger);
            }
        }
    },
    'timestamps': {
        topic: function() {
            var args = null,
                log = function() {
                    args = Array.prototype.slice.call(arguments);
                },
                logger = davlog.init({
                    timestamps: true,
                    color: false
                }),
                oldToISO = Date.prototype.toISOString;

            logger.logFn = log;

            Date.prototype.toISOString = function(){
                return 'FAKE_ISO_STRING';
            };
            
            logger.log('this is a test');
            
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
