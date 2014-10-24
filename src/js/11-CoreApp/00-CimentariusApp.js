var Cimentarius = angular.module('Cimentarius', ['ui.bootstrap','ui.tree']);

Cimentarius.config(function($locationProvider) {
    // use the HTML5 History API
//    $locationProvider.html5Mode(true);
});

Cimentarius.factory('cimentariusService', function($rootScope) {
    var cimentariusService = {
        // Flash banners
        alerts: [],
        // built controller stuffs
        options: {}
    };
    cimentariusService.addAlert = function(msg) {
        if(!msg.length) msg = [msg];
        while(msg.length) {
            cimentariusService.alerts.push(msg.pop());
        }
        cimentariusService.updateAlerts();
    };

    cimentariusService.updateAlerts = function() {
        $rootScope.$broadcast('updateAlerts');
    };

    return cimentariusService;
});

Cimentarius.controller('Cimentarius', ['$scope','cimentariusService', function ($scope, cimentariusService) {
    $scope.init = function(options) {
        cimentariusService.options = options;
    }
}]);

Cimentarius.filter('asHtml', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);