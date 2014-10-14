Cimentarius.controller('BootstrapAlert', ['$scope', 'cimentariusService', function($scope, cimentariusService) {
    $scope.alerts = [];

    $scope.init = function(alerts) {
        if(alerts) cimentariusService.addAlert(alerts);
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.$on('updateAlerts', function() {
        while(cimentariusService.alerts.length) {
            $scope.alerts.push(cimentariusService.alerts.pop());
        }
    });
}]);