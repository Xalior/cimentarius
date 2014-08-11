'use strict';

var server = {
	cimentarius: require('./lib/cimentarius')
};

console.log("server:");
console.log(server);

if (require.main === module) {
    server.cimentarius.process();
}

module.exports = server;
