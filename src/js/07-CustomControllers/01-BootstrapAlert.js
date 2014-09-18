Cimentarius.controller('BootstrapAlert', function($scope) {

    $scope.init = function(alerts) {
        $scope.alerts = alerts;
    };

    console.log($scope.alerts);

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
});