Cimentarius.controller('SiteOverviewAccordion', function ($scope, $http) {
    $scope.init = function () {
        $scope.reload();
    };

    $scope.reload = function() {
        $http.get(Cimentarius._adminRoot+'/api/sitemap').
            success(function(data, status, headers, config) {
                $scope.update(data);
            }).
            error(function(data, status, headers, config) {
                console.log(data);
            });
    };

    $scope.update = function(data) {
        $scope.sites = data;
    }

    $scope.oneAtATime = true;

    $scope.sites = [];
});