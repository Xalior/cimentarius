Cimentarius.controller('particleController', ['$scope', '$http', '$location', 'cimentariusService', function($scope, $http, $location, cimentariusService) {
    $scope.submitted = false;
    $scope.serverErrors = {};

    $scope.submit = function() {
        var that = this;

        if (that.particleForm.$valid) {
            that.particleForm.submitted = true;
            $http({
                method: 'POST',
                url: $location.$$absUrl,
                data: $scope.particle
            }).success(function(data, status, headers, cfg) {
                console.log($scope);
                if(data.errors) {
                    for (var key in data.errors) {
                        var obj = data.errors[key];
                        for (var prop in obj) {
                            if(obj.hasOwnProperty(prop)){
                                $scope.serverErrors[key] = obj[prop];
                                $scope.particleForm[key].$setValidity('serverSide', false);
                            }
                        }
                    }
                } else {
                    cimentariusService.addAlert([{
                        type: 'success',
                        msg: 'Job Done'
                    }]);
                    $scope.particle = data;
                }
            }).error(function(data, status, headers, cfg) {
                console.error(data);
            });
        } else {
            that.particleForm.submitted = false;
        }
    };

    $scope.change = function(name) {
        var that = this;

        console.log("particle change");
        if(name) {
            console.log(name);
            console.log($scope.particleForm);
            that.particleForm.$setDirty();
        }
        for (var key in $scope.serverErrors) {
            var obj = $scope.serverErrors[key];
            for (var prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    $scope.serverErrors[key] = '';
                    that.particleForm[key].$setValidity('serverSide', true);
                }
            }
        }
    };

    $scope.init = function(data) {
        $scope.particle = data;

    };
}]);