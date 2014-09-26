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
        <h2>Sites</h2>
        <div ng-controller="SiteOverviewAccordion" ng-init='init()'>
          <accordion close-others="{{oneAtATime}}">
            <accordion-group ng-repeat="site in sites">
              <accordion-heading>
                {{site.title}} <i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': status.open, 'glyphicon-chevron-right': !status.open}"></i>
              </accordion-heading>
            <script type="text/ng-template" id="page_renderer.html">
                <div ng-class="{ 'select': $treeScope.multiSelect, 'copy': $treeScope.copy }">
                  <a class="btn btn-success btn-xs" ng-if="page.pages && page.pages.length > 0" nodrag ng-click="toggle(this)">
                    <span class="glyphicon" ng-class="{'glyphicon-chevron-right': collapsed, 'glyphicon-chevron-down': !collapsed}"></span>
                  </a>
                  {{page.title}}
                </div>
                <ol ui-tree-nodes ng-model="page.pages">
                  <li ng-repeat="page in page.pages" ui-tree-node ng-include="'page_renderer.html'"></li>
                </ol>
            </script>
              <div ui-tree data-drag-enabled='false'>
                              <ol ui-tree-nodes ng-model="site.pages">
                                <li ng-repeat="page in site.pages"
                                    ui-tree-node
                                    ng-class="{ 'selected': selected, 'original': original }"
                                    ng-include="'page_renderer.html'"></li>
                              </ol>
              </div ui-tree>
            </accordion-group>
          </accordion>
        </div>
    </div>
{% endblock %}