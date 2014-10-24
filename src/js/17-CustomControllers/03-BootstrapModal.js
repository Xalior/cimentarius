Cimentarius.controller('BootstrapModalController', ['$scope', '$modalInstance', 'cimentariusService', function($scope, $modalInstance, cimentariusService) {
    $scope.title = cimentariusService.modalTitle;
    $scope.body = cimentariusService.modalBody;

    $scope.ok = function () {
        console.log('modal.ok');
        $modalInstance.close();
    };

    $scope.cancel = function () {
        console.log('modal.cancel');
        $modalInstance.dismiss('cancel');
    };
}]);