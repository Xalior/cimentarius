Cimentarius.controller('pageController', ['$scope', function($scope) {
    $scope.submitted = false;

    $scope.submit = function() {
        if ($scope.form.$valid) {

        } else {
            $scope.form.submitted = true;
        }
    }
}]);