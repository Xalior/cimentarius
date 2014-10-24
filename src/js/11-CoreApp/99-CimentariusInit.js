Cimentarius.controller('Cimentarius', ['$scope','cimentariusService', function ($scope, cimentariusService) {
    $scope.init = function(options) {
        cimentariusService.options = options;
    }
}]);
