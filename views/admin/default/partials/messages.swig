<div ng-controller="BootstrapAlert" ng-init='init({~ _messages| safe ~})'>
    <alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">{{alert.msg}}</alert>
</div>