Cimentarius.controller('pageController', ['$scope', '$http', '$location', 'cimentariusService', function($scope, $http, $location, cimentariusService) {
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
                    $location.path(Cimentarius._adminRoot+'/page/'+data.id);
                    cimentariusService.addAlert([{
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

        if(name) {
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