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
                //'        <a ng-if="option.name" ng-click="select(option.name)" class="template-menu-item">' +
            '          <div>{{ contentBlock.description }}</div>' +
            '          <div>{{ contentBlock.name }}</div>' +
            '          <div>{{ contentBlock.limit }}</div>' +
                //'        </a>' +
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