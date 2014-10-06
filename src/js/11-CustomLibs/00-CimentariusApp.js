var Cimentarius = angular.module('Cimentarius', ['ui.bootstrap','ui.tree']);

Cimentarius.factory('sharedService', function($rootScope) {
    var sharedService = {
        alerts: []
    };

    sharedService.addAlert = function(msg) {
        if(!msg.length) msg = [msg];
        while(msg.length) {
            sharedService.alerts.push(msg.pop());
        }
        sharedService.updateAlerts();
    };

    sharedService.updateAlerts = function() {
        $rootScope.$broadcast('updateAlerts');
    };

    return sharedService;
});