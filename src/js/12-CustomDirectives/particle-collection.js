/*

 */

Cimentarius.directive('particleCollection', function () {
        return {
            replace: true,
            require: ['ngModel'],
            transclude: true,
            template: '<div>' +
                '  <div>' +
                '    <ul class="particle-list">' +
                '      <li ng-repeat="contentBlock in contentBlocks.contentBlocks" class="content-block">' +
                '        <div class="row">' +
                '          <div class="col-sm-2 columns">&nbsp;</div>' +
                '          <div class="col-sm-7 columns">{{ contentBlock.description }}</div>' +
                '          <div class="col-sm-3 columns" dropdown is-open="status.isopen">' +
                '            <button type="button" class="btn-xs btn-primary dropdown-toggle">' +
                '              <small>Add Content <span class="caret"></span></small>' +
                '            </button>' +
                '            <ul class="dropdown-menu" role="menu">' +
                '              <li class="particle-menu filter disabled"><a href="#">{{ contentBlock.limit }}</a></li>' +
                '              <li class="divider"></li>' +
                '              <li ng-repeat="content in contentTypes" class="particle-menu">' +
                '                <a ng-click="select(content.type, contentBlock.name)" class="particle-menu-item">' +
                '                  {{ content.name }} ' +
                '                </a>' +
                '              </li>' +
                '            </ul>' +
                '          </div>' +
                '        </div>' +
                '        <ul class="particles-list">' +
                '          <li ng-repeat="particle in contentBlock.particles" class="particle">' +
                '            {{ particle }}' +
                '          </li>' +
                '        </ul>' +
                '        <br />' +
                '      </li>' +
                '    </ul>' +
                '  </div>' +
                '</div>',
            controller: ['$scope', '$sce', function($scope) {
                console.log('particleCollection.controller');
                console.log($scope);
            }],
            link: function( scope, element, attributes, controller ) {
                if (scope.value) {
                    scope.select(scope.value, true);
                }
            },
            restrict: 'EA',
            scope: {
                options: '=',
                contentBlocks: '=ngModel',
                name: '@'
            }
        }
    }
);