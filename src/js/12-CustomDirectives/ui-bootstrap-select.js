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
                      '      <a ng-click="select()" class="template-menu-item">' +
                      '        <div class="">{{ option.name }}</div>' +
                      '        <div class=""><img src="http://froggyadventures.com/wp-content/uploads/galleries/post-93/full/placeholder%20-%20Copy%20(2).gif"></div>' +
                      '      </a>' +
                      '    </li>' +
                      '    <li class="divider"></li>' +
                      '    <li>' +
                      '     <a ng-click="select(\'_system_definted_default\')" class="template-menu-default-item">System Assigned Default</a></li>' +
                      '  </ul>' +
                      '</div>',
            controller: ['$scope', function($scope) {
                $scope.select = function(name) {
                    if(name!='_system_definted_default') {
                        $scope.value = $scope.options[this.$index].name;
                    } else {
                        $scope.value = 'System Assigned Default';
                    }
                    $scope.status.isopen = false;
                },
                $scope.status = {
                    isopen: false
                };
            }],
            restrict: 'A',
            scope: {
                options: '=options'
            }
        }
    }
);