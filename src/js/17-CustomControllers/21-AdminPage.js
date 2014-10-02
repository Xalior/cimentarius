Cimentarius.controller('pageController', ['$scope', function($scope) {
    $scope.submitted = false;

    $scope.submit = function() {
        console.log(pageForm);
        if ($scope.pageForm.$valid) {
            console.log('valid');
        } else {
            $scope.pageForm.submitted = true;
        }
    }
}]);