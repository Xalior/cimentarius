Cimentarius.controller('BootstrapAlert', function($scope) {

    $scope.init = function(alerts) {
        $scope.alerts = alerts;
    };

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
});