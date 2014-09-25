{% extends 'layouts/master.swig' %}

{% block content %}
    <div class="col-md-9">
        <div class="page-header">
            <h1>
                Welcome - Dashboard
            </h1>
        </div>
    </div>
    <div class="col-md-3">
        <div ng-controller="BootstrapAccordion">
          <accordion close-others="false">
            <accordion-group heading="Static Header, initially expanded">
              This content is straight in the template.
            </accordion-group>
            <accordion-group heading="{{group.title}}" ng-repeat="group in groups">
              {{group.content}}
            </accordion-group>
            <accordion-group heading="Dynamic Body Content">
              <p>The body of the accordion group grows to fit the contents</p>
                <button class="btn btn-default btn-sm" ng-click="addItem()">Add Item</button>
                <div ng-repeat="item in items">{{item}}</div>
            </accordion-group>
            <accordion-group is-open="status.open">
                <accordion-heading>
                    I can have markup, too! <i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': status.open, 'glyphicon-chevron-right': !status.open}"></i>
                </accordion-heading>
                This is just some content to illustrate fancy headings.
            </accordion-group>
          </accordion>
        </div>
    </div>
{% endblock %}