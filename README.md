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

info
----
