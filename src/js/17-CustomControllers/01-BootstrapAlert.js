Cimentarius.controller('BootstrapAlert', ['$scope', 'sharedService', function($scope, sharedService) {
    $scope.alerts = [];

    $scope.init = function(alerts) {
        if(alerts) sharedService.addAlert(alerts);
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.$on('updateAlerts', function() {
        while(sharedService.alerts.length) {
            $scope.alerts.push(sharedService.alerts.pop());
        }
    });
}]);