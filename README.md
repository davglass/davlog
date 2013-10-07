davlog
======

This is the logger that I use in my CLI tools.

usage
-----

```javascript

var logger = require('davlog');

logger.setup({
    name: 'foo',
    color: 'white'
}); //Should only need once

logger.info('This is a test');

```

`foo [info] This is test`

Build Status
------------

[![Build Status](https://secure.travis-ci.org/davglass/davlog.png?branch=master)](http://travis-ci.org/davglas/davlog)

Node Badge
----------

[![NPM](https://nodei.co/npm/davlog.png)](https://nodei.co/npm/davlog/)
----
