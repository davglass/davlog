davlog
======

This is the logger that I use in my CLI tools.

usage
-----

```javascript

var davlog = require('davlog');

var logger = davlog.init({
    name: 'foo',
    color: 'white'
}); //Should only need once

logger.info('This is a test');

```

```foo [info] This is test```

Note that the module is an instance of itself, with the default options:

```javascript

var davlog = require('davlog');

davlog.info('This is a test');

```

```davlog [info] This is test```


methods
-------

  * `info`
  * `log` 
  * `warn`
  * `err`
  * `error` Will `process.exit(1)` when called.
  * `silent` Disable all output
  * `quiet` Disable all but log and info

options
-------

The `init` function allows for 3 options:

   * `name` - The name prefix to the string: Defaults to: 'davlog'
   * `color` - The string for the color or `false` to disable color: Defaults to `magenta`
   * `timestamps` - If true, adds an ISO timestamp to the beginning of each log line.
   * `stdout` - A writeable stream for normal log messages: Defaults to `process.stdout`
   * `stderr` - A writeable stream for error log messages: Defaults to `process.stderr`

You can override all prefixes by using the: `logger.STRINGS` object.
You can override all default colors by using the `logger.COLORS` object.

There are also `stdout` and `stderr` properties on the object, which are
readable streams. These are useful for piping log data elsewhere.

build status
------------

[![Build Status](https://secure.travis-ci.org/davglass/davlog.png?branch=master)](http://travis-ci.org/davglass/davlog)

node badge
----------

[![NPM](https://nodei.co/npm/davlog.png)](https://nodei.co/npm/davlog/)
----
