'use strict';
var config = require('./lib/config');

console.log(config);

var server = {
	cimentarius: require('./lib/cimentarius')
};

console.log("server:");
console.log(server);

if (require.main === module) {
    server.cimentarius.process();
}

module.exports = server;
