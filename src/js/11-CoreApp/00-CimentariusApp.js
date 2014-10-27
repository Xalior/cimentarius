var Cimentarius = angular.module('Cimentarius', ['ui.bootstrap','ui.tree', 'dndLists']);


Cimentarius.filter('asHtml', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);