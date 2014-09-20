<div ng-controller="BootstrapAlert" ng-init='init({{ _messages| safe }})'>
    <alert ng-repeat="alert in alerts" type="{% raw %}{{alert.type}}{% endraw %}" close="closeAlert($index)">{% raw %}{{alert.msg}}{% endraw %}</alert>
</div>