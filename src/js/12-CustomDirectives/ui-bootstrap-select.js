/*
 *
 *
 * Help via: http://www.sitepoint.com/practical-guide-angularjs-directives/
 *
 */

Cimentarius.directive('cmtSelect', function () {
        return {
            replace: true,
            template: '<div class="btn-group" dropdown is-open="status.isopen">' +
                      '  <button type="button" class="btn btn-primary dropdown-toggle">' +
                      '    {{ value }} <span class="caret"></span>' +
                      '  </button>' +
                      '  <ul class="dropdown-menu" role="menu">' +
                      '    <li ng-repeat="option in options">' +
                      '      <a href="#" ng-click="select()">{{ option.name }}</a>' +
                      '    </li>' +
                      '    <li class="divider"></li>' +
                      '    <li><a href="#">System Assigned Default</a></li>' +
                      '  </ul>' +
                      '</div>',
            controller: ['$scope', function($scope) {
                $scope.select = function() {
                    $scope.value = $scope.options[this.$index].name;
                }
            }],
            restrict: 'A',
            scope: {
                options: '=options'
            }
        }
    }
);