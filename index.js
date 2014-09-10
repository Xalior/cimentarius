'use strict';
require('./lib/harmony.js');

var config = require('./lib/config');

console.log(config);

var cimentarius = require('./lib/cimentarius')

if (require.main === module) {
    cimentarius.main();
}

module.exports = cimentarius;
