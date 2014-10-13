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
                '          <div class="col-sm-1 columns">&nbsp;</div>' +
                '          <div class="col-sm-8 columns">{{ contentBlock.description }}</div>' +
                '          <div class="col-sm-3 columns" dropdown is-open="status.isopen">' +
                '            <button type="button" class="btn-xs btn-primary dropdown-toggle fullwidth">' +
                '              <small>Add Content <span class="caret"></span></small>' +
                '            </button>' +
                '            <ul class="dropdown-menu" role="menu">' +
                '              <li class="particle-menu filter disabled">{{ contentBlock.limit }}</li>' +
                '              <li class="divider"></li>' +
                '              <li ng-repeat="(type, typeDetails) in contentBlock.contentTypes" class="particle-menu">' +
                '                <a ng-click="select()" class="particle-menu-item">' +
                '                 {{ typeDetails.displayName }}' +
                '                </a>' +
                '                <ul class="sub-menu" role="menu">' +
                '                  <li ng-repeat="(content, contentDetails) in typeDetails.contentTypes" class="particle-menu">' +
                '                    <a href="#"><span class="glyphicon {{ contentDetails.className }}"></span> {{ contentDetails.displayName }}</a>' +
                '                  </li>' +
                '                </ul>' +
                '              </li>' +
                '            </ul>' +
                '          </div>' +
                '        </div>' +
                '        <ul class="particles-list">' +
                '          <li ng-repeat="particle in contentBlock.particles" class="particle">' +
                '            {{ particle }}' +
                '          </li>' +
                '        </ul>' +
                '      </li>' +
                '    </ul>' +
                '  </div>' +
                '</div>',
            controller: ['$scope', '$sce', function($scope) {
                console.log('particleCollection.controller');
                console.log($scope);
            }],
            restrict: 'EA',
            scope: {
                options: '=',
                contentBlocks: '=ngModel',
                name: '@'
            }
        }
    }
);