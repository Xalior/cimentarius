{% extends 'layouts/master.swig' %}

{% block content %}
    <div class="col-md-8">
        <div class="page-header">
            <h1>
                Welcome - Dashboard
            </h1>
        </div>
    </div>
    <div class="col-md-4">
        <h2>Sites</h2>
        <div ng-controller="SiteOverviewAccordion" ng-init='init()'>
            <accordion close-others="{{oneAtATime}}">
                <accordion-group ng-repeat="site in sites">
                    <accordion-heading>
                        {{site.title}} <i class="pull-right glyphicon" ng-class="{'glyphicon-chevron-down': status.open, 'glyphicon-chevron-right': !status.open}"></i>
                    </accordion-heading>
                    <script type="text/ng-template" id="page_renderer.html">
                        <div ui-tree-handle class="tree-node tree-node-content">
                            <a class="btn btn-success btn-xs" ng-if="page.pages && page.pages.length > 0" nodrag ng-click="toggle(this)"><span class="glyphicon" ng-class="{'glyphicon-chevron-right': collapsed, 'glyphicon-chevron-down': !collapsed}"></span></a>
                            <a class="btn btn-success btn-xs disabled" ng-if="page.pages == undefined || page.pages.length == 0" nodrag><span class="glyphicon glyphicon-minus"></span></a>
                            <a href="{~_adminRoot~}/page/{{page.id}}/" tooltip-placement="right" tooltip="{{site.url}}{{page.slug}}">{{page.title}}</a>
                            <a class="pull-right btn btn-danger btn-xs" ng-if="page.slug != '/'" nodrag ng-click="remove(this)"><span class="glyphicon glyphicon-remove"></span></a>
                            <a class="pull-right btn btn-danger btn-xs disabled" ng-if="page.slug == '/'" nodrag ng-click="remove(this)"><span class="glyphicon glyphicon-remove"></span></a>
                            <a class="pull-right btn btn-primary btn-xs" nodrag ng-click="newSubItem(this)" style="margin-right: 8px;"><span class="glyphicon glyphicon-plus"></span></a>

                        </div>
                        <ol ui-tree-nodes ng-model="page.pages" ng-class="{hidden: collapsed}">
                            <li ng-repeat="page in page.pages" ui-tree-node ng-include="'page_renderer.html'"></li>
                        </ol>
                    </script>

                    <div ui-tree data-drag-enabled='false'>
                        <ol ui-tree-nodes ng-model="site.pages">
                            <li ng-repeat="page in site.pages"
                                ui-tree-node
                                ng-class="{ 'selected': selected, 'original': original}"
                                ng-include="'page_renderer.html'"></li>
                        </ol>
                    </div>
                </accordion-group>
            </accordion>
        </div>
    </div>
{% endblock %}