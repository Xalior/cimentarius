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
                      '    <li ng-repeat="option in options" class="template-menu">' +
                      '      <a ng-click="select(option.name)" class="template-menu-item">' +
                      '        <div class="">{{ option.name }}</div>' +
                      '        <div class=""><img src="http://froggyadventures.com/wp-content/uploads/galleries/post-93/full/placeholder%20-%20Copy%20(2).gif" height="50%"></div>' +
                      '      </a>' +
                      '    </li>' +
                      '    <li class="divider"></li>' +
                      '    <li>' +
                      '     <a ng-click="select(\'System Assigned Default\')" class="template-menu-default-item">System Assigned Default</a></li>' +
                      '  </ul>' +
                      '  <input type="hidden" value="{{ value }}" name="{{ name }}"/>' +
                      '</div>',
            controller: ['$scope', function($scope) {
                $scope.select = function(name) {
                    $scope.value = name;
                    $scope.status.isopen = false;
                };
                $scope.status = {
                    isopen: false
                };
            }],
            link: function( scope, element, attributes, controller ) {
                if (scope.value) {
                    console.log('got avlu' + scope.value);
                    scope.select(scope.value);
                }
            },
            restrict: 'EA',
            scope: {
                options: '=',
                value: '@',
                name: '@'
            }
        }
    }
);