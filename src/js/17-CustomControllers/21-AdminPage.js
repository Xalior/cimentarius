Cimentarius.controller('pageController', ['$scope', '$http', '$location', 'sharedService', function($scope, $http, $location, sharedService) {
    $scope.submitted = false;
    $scope.serverErrors = {};

    $scope.submit = function() {
        var that = this;

        if (that.pageForm.$valid) {
            that.pageForm.submitted = true;
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
                    sharedService.addAlert([{
                        type: 'success',
                        msg: 'Job Done'
                    }]);
                    $scope.page = data;
                }
            }).error(function(data, status, headers, cfg) {
                console.error(data);
            });
        } else {
            that.pageForm.submitted = false;
        }
    };

    $scope.change = function(name) {
        var that = this;

        console.log("page change");
        if(name) {
            console.log(name);
            console.log($scope.pageForm);
            that.pageForm.$setDirty();
        }
        for (var key in $scope.serverErrors) {
            var obj = $scope.serverErrors[key];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    $scope.serverErrors[key] = '';
                    that.pageForm[key].$setValidity('serverSide', true);
                }
            }
        }
    };

    $scope.init = function(data) {
        $scope.page = data;

    };
}]);