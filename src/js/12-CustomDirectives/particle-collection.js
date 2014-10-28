/*

 */

Cimentarius.directive('particleCollection', function () {
        return {
            replace: true,
            require: ['ngModel'],
            transclude: true,
            template:
                '      <div class="particleCollection">'+
                '        <div class="row">' +
                '          <div class="col-sm-1 columns">&nbsp;</div>' +
                '          <div class="col-sm-8 columns">{{ contentBlock.description }}</div>' +
                '          <div class="col-sm-3 columns" dropdown>' +
                '            <button type="button" class="btn-xs btn-primary dropdown-toggle fullwidth">' +
                '              <small>Add Content <span class="caret"></span></small>' +
                '            </button>' +
                '            <ul class="dropdown-menu" role="menu" ng-model="contentBlock.types">' +
                '              <li ng-repeat="(type, typeDetails) in contentBlock.types" class="particle-menu">' +
                '                <a ng-click="select()" class="particle-menu-item">' +
                '                 {{ typeDetails.displayName }}' +
                '                </a>' +
                '                <ul class="sub-menu" role="menu">' +
                '                  <li ng-repeat="(content, contentDetails) in typeDetails.types" class="particle-menu">' +
                '                    <a href="{{ cimentariusService.options._adminRoot }}/particle/NEW/{{ page.type }}/{{ page.id }}/{{ contentBlock.name }}/{{ type }}/{{ content}}"><span class="glyphicon {{ contentDetails.className }}"></span> {{ contentDetails.displayName }} </a' +
                '                  </li>' +
                '                </ul>' +
                '              </li>' +
                '            </ul>' +
                '          </div>' +
                '        </div>' +
                '        <ul class="particle-list" dnd-list="contentBlock.particles">' +
                '          <li ng-if="contentBlock.particles.length" ng-repeat="particle in contentBlock.particles" class="particle" id="particle_{{ particle.id }}" ' +
                '           dnd-draggable="particle" dnd-moved="contentBlock.particles.splice($index, 1)" dnd-effect-allowed="move" dnd-selected="models.selected = particle" ' +
                '           ng-class="{\'selected\': models.selected === particle}">' +
                '            <div class="row">' +
                '              <div class="glyphicon {{ particle.className }} particle-type col-sm-1 columns" tooltip="{{ particle.type}}"></div>' +
                '              <div class="col-sm-7 columns">' +
                '                {{ particle.title }}' +
                '                {{ particle.position }}' +
                '              </div>' +
                '              <div class="col-sm-2 columns" dropdown>' +
                '                <button type="button" class="btn-xs btn-primary dropdown-toggle fullwidth">' +
                '                  <small>More&hellip; <span class="caret"></span></small>' +
                '                </button>' +
                '                <ul class="dropdown-menu" role="menu" ng-model="contentBlock.types">' +
                '                  <h6>New Content <strong>ABOVE</strong>&hellip;</h6>' +
                '                  <li ng-repeat="(type, typeDetails) in contentBlock.types" class="particle-menu">' +
                '                    <a ng-click="select()" class="particle-menu-item">' +
                '                     {{ typeDetails.displayName }}' +
                '                    </a>' +
                '                    <ul class="sub-menu" role="menu">' +
                '                      <li ng-repeat="(content, contentDetails) in typeDetails.types" class="particle-menu">' +
                '                        <a href="{{ cimentariusService.options._adminRoot }}/particle/NEW/{{ page.type }}/{{ page.id }}/{{ contentBlock.name }}/{{ type }}/{{ content}}"><span class="glyphicon {{ contentDetails.className }}"></span> {{ contentDetails.displayName }} </a' +
                '                      </li>' +
                '                    </ul>' +
                '                  </li>' +
                '                </ul>' +
                '              </div>' +
                '            </div>' +
                '          </li>' +
                '          <li ng-if="!contentBlock.particles.length" class="no-particles">' +
                '            <div>' +
                '              <span class="glyphicon glyphicon-warning-sign"></span>This content block is empty&hellip;<br /><em>Content blocks invariably look better when they contain content!</em>' +
                '            </div>' +
                '          </li>' +
                '        </ul>' +
                '      </div>',
            controller: ['$scope', 'cimentariusService', function($scope, cimentariusService) {
                $scope.cimentariusService = cimentariusService;
                console.log($scope);
            }],
            link: function( scope, element, attributes, controller ) {
                if (scope.value) {
                    scope.select(scope.value, true);
                }
            },
            restrict: 'EA',
            scope: {
                contentBlock: '=ngModel',
                page: '=page'
            }
        }
    }
);