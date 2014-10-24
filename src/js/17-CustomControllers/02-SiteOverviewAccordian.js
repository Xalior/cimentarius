Cimentarius.controller('SiteOverviewAccordion', ['$scope', '$http', 'cimentariusService', function ($scope, $http, cimentariusService) {
    $scope.init = function () {
        $scope.reload();
        console.log("this is init)");
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
    };

    $scope.removePage = function(page) {
        var that = this;
        cimentariusService.modalSet('Delete this page?', 'Are you sure you want to delete "'+page.title+'"?<br /><strong>This will delete all the subpages too!</strong>', function(result){
            alert(page.title);
            that.remove()
        });
        cimentariusService.modalOpen();

    };

    $scope.oneAtATime = true;

    $scope.sites = [];
}]);