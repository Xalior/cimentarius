/*
 * Help via: http://www.sitepoint.com/practical-guide-angularjs-directives/
 *
 */

Cimentarius.directive('cmtSelect', function () {
        return {
            replace: true,
            require: ['ngModel'],
            transclude: true,
            template: '<div class="btn-group" dropdown is-open="status.isopen">' +
                      '  <button type="button" class="btn btn-primary dropdown-toggle">' +
                      '    {{ value }} <span class="caret"></span>' +
                      '  </button>' +
                      '  <ul class="dropdown-menu" role="menu">' +
                      '    <li ng-repeat="option in options" class="template-menu" ng-class="{divider: option.name == \'\'}" >' +
                      '      <a ng-if="option.name" ng-click="select(option.name)" class="template-menu-item">' +
                      '        <div class="">{{ option.name }}</div>' +
                      '        <div ng-if="option.name!=\'System Defined Default\'" class=""><img src="http://froggyadventures.com/wp-content/uploads/galleries/post-93/full/placeholder%20-%20Copy%20(2).gif" height="50%"></div>' +
                      '      </a>' +
                      '    </li>' +
                      '  </ul>' +
                      '</div>',
            controller: ['$scope', function($scope) {
                $scope.select = function(name, _init) {
                    $scope.value = name;
                    if(!_init) {
                        if (typeof $scope.$parent.change == 'function') $scope.$parent.change($scope.name);
                        $scope.status.isopen = false;
                    }
                };
                $scope.status = {
                    isopen: false
                };
            }],
            link: function( scope, element, attributes, controller ) {
                if (scope.value) {
                    scope.select(scope.value, true);
                }
            },
            restrict: 'EA',
            scope: {
                options: '=',
                value: '=ngModel',
                name: '@'
            }
        }
    }
);