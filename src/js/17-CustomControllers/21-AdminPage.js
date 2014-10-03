Cimentarius.controller('pageController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.submitted = false;

    $scope.serverErrors = {};

    $scope.submit = function() {
        if ($scope.pageForm.$valid) {
            $scope.pageForm.submitted = true;
            $http({
                method: 'POST',
                url: $location.$$absUrl,
                data: $scope.page
            }).success(function(data, status, headers, cfg) {
                if(data.errors) {
                    for (var key in data.errors) {
                        var obj = data.errors[key];
                        for (var prop in obj) {
                            if(obj.hasOwnProperty(prop)){
                                $scope.serverErrors[key] = obj[prop];
                                $scope.pageForm[key].$setValidity('serverSide', false);
                            }
                        }
                    }
                } else {
                    console.log('job done');
                }
            }).error(function(data, status, headers, cfg) {
                console.error(data);
            });
        } else {
            $scope.pageForm.submitted = false;
        }
    };

    $scope.change = function() {
        for (var key in $scope.serverErrors) {
            var obj = $scope.serverErrors[key];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    $scope.serverErrors[key] = '';
                    $scope.pageForm[key].$setValidity('serverSide', true);
                }
            }
        }
    };

    $scope.init = function(data) {
        $scope.page = data;

    };
}]);