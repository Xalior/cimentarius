/*

 */

Cimentarius.directive('particleCollection', function () {
        return {
            replace: true,
            require: ['ngModel'],
            transclude: true,
            template:
                '       <div class="particleCollection">'+
                '        <div class="row">' +
                '          <div class="col-sm-1 columns">&nbsp;</div>' +
                '          <div class="col-sm-8 columns">{{ contentBlock.description }}</div>' +
                '          <div class="col-sm-3 columns" dropdown is-open="status.isopen">' +
                '            <button type="button" class="btn-xs btn-primary dropdown-toggle fullwidth">' +
                '              <small>Add Content <span class="caret"></span></small>' +
                '            </button>' +
                '            <ul class="dropdown-menu" role="menu">' +
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
                '        <ul class="particle-list">' +
                '          <li ng-if="contentBlock.particles.length" ng-repeat="particle in contentBlock.particles" class="particle">' +
                '            {{ particle }}' +
                '          </li>' +
                '          <li ng-if="!contentBlock.particles.length" class="no-particles">' +
                '            <span class="glyphicon glyphicon-warning-sign"></span>This content block is empty&hellip;<br /><em>Content blocks invariably look better when they contain content!</em>' +
                '          </li>' +
                '        </ul>' +
                '       </div>',
            controller: ['$scope', '$sce', function($scope) {
                console.log('particleCollection.controller');
                console.log($scope);
            }],
            link: function( scope, element, attributes, controller ) {
                console.log('particleCollection.link');
                console.log(scope);
                if (scope.value) {
                    scope.select(scope.value, true);
                }
            },
            restrict: 'EA',
            scope: {
                contentBlock: '=ngModel',
            }
        }
    }
);