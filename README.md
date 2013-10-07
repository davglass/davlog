davlog
======

This is the logger that I use in my CLI tools.

usage
-----

```javascript

var logger = require('davlog');

logger.init({
    name: 'foo',
    color: 'white'
}); //Should only need once

logger.info('This is a test');

```

```foo [info] This is test```


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

The `init` function allows for 2 options:

   * `name` - The name prefix to the string: Defaults to: 'davlog'
   * `color` - The string for the color or `false` to disable color: Defaults to `magenta`

You can override all prefixes by using the: `davlog.STRINGS` object.
You can override all default colors by using the `davlog.COLORS` object.


build status
------------

[![Build Status](https://secure.travis-ci.org/davglass/davlog.png?branch=master)](http://travis-ci.org/davglass/davlog)

node badge
----------

[![NPM](https://nodei.co/npm/davlog.png)](https://nodei.co/npm/davlog/)
----
