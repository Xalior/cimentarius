var path = require("path");

module.exports = config = {
    "name" : "Cimentarius",

    "listen_port" : 8080,
    "listen_address" : "127.0.0.1",
    // Admin URL
    "admin": ".admin",
    "salt": "BuildingBlocksAreNiceButARealCraftsmanNeedsMasonry",

    // And the details for saving...
    "dbUser" : "cimentarius",
    "dbPass" : "you_secret_password",
    "dbName" : "cimentarius_sitename",
    "dbHost" : "localhost",
    "dbPort" : 3306,

    //middleware settings
    "middlewares": {
        render: {
            cache: false
        }
    },

    // 'getters'
    "getInstallPath": function() {
        return path.resolve(__dirname + '../..');
    }
};
