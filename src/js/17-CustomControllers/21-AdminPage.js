Cimentarius.controller('pageController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.submitted = false;

    $scope.submit = function() {
        console.log(pageForm);
        if ($scope.pageForm.$valid) {
            console.log('valid');
            $scope.pageForm.submitted = true;
            console.log($location);
            $http({
                method: 'POST',
                url: $location.$$absUrl,
                data: $scope.page
            }).success(function(data, status, headers, cfg) {
                console.log(data);
            }).error(function(data, status, headers, cfg) {
                console.error(data);
            });
        } else {
            $scope.pageForm.submitted = false;
        }
    }

    $scope.init = function(data) {
        $scope.page = data;

    }
}]);