{% extends '../layouts/master.swig' %}

{% block content %}
    <div class="col-md-8">
        <div ng-controller="pageController" ng-init="init({~page~})">
            <div class="page-header">
                <h1>Page Details</h1>
            </div>
            <form name="pageForm" novalidate ng-submit="submit()" method="POST">
                <fieldset>
                    <legend>Basics</legend>
                    <div class="form-group">
                            <div class="large-12 columns">
                                <label for="title">Title</label>
                                <input type="text"
                                       class="form-control"
                                       placeholder="Page Title"
                                       name="title"
                                       ng-model="page.title"
                                       ng-change="change()"
                                       ng-minlength=1
                                       ng-maxlength=64
                                       required />
                                <div class="error-container" ng-show="pageForm.title.$dirty && pageForm.title.$invalid">
                                    <small class="error" ng-show="pageForm.title.$error.required">All pages require a title.</small>
                                    <small class="error" ng-show="pageForm.title.$error.minlength">A page title is required to be at least 1 characters</small>
                                    <small class="error" ng-show="pageForm.title.$error.maxlength">A page title cannot be longer than 64 characters</small>
                                    <small class="error" ng-show="pageForm.title.$error.serverSide">{{ serverErrors.title }}</small>
                                </div>
                        </div>
                            <div class="large-12 columns">
                                <label for="slug">Slug</label>
                                <input type="text"
                                       class="form-control"
                                       placeholder="URL for this page"
                                       name="slug"
                                       ng-model="page.slug"
                                       ng-change="change()"
                                       ng-minlength=1
                                       ng-maxlength=64
                                       required />
                                <div class="error-container" ng-show="pageForm.slug.$dirty && pageForm.slug.$invalid">
                                    <small class="error" ng-show="pageForm.slug.$error.required">Please input a slug</small>
                                    <small class="error" ng-show="pageForm.slug.$error.minlength">Your username is required to be at least 1 characters</small>
                                    <small class="error" ng-show="pageForm.slug.$error.maxlength">Your username cannot be longer than 64 characters</small>
                                    <small class="error" ng-show="pageForm.slug.$error.unique">That slug is already used at this level, please try another</small>
                                    <small class="error" ng-show="pageForm.slug.$error.serverSide">{{ serverErrors.slug }}</small>
                                </div>
                            </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend ng-click="showAdvanced = !showAdvanced">Advanced
                        <span class="legend-buttons">
                            <button type="button" class="btn btn-primary btn-xs" ng-show="showAdvanced">Hide</button>
                            <button type="button" class="btn btn-primary btn-xs" ng-show="!showAdvanced">Show</button>
                        </span>
                    </legend>
                    <div class="form-group" collapse="!showAdvanced">
                            <div class="large-12 columns">
                                <label for="">Page Template</label>
                                <br />
                                <div class="btn-group" dropdown is-open="status.isopen">
                                    <button type="button" class="btn btn-primary dropdown-toggle">
                                        {{ page.template }} <span class="caret"></span>
                                    </button>
                                    <ul class="dropdown-menu" role="menu">
                                        <li ng-repeat="template in pageTemplates">
                                            <a href="#">pageTemplate.name</a>
                                        </li>
                                        <li class="divider"></li>
                                        <li><a href="#">System Assigned Default</a></li>
                                    </ul>
                                </div>
                                <input type="hidden"
                                       class="form-control"
                                       placeholder="Layout Template for this Page"
                                       name="template"
                                       ng-model="page.template"
                                       ng-change="change()" />
                                <div class="error-container" ng-show="pageForm.template.$dirty && pageForm.metaDescription.$invalid">
                                    <small class="error" ng-show="pageForm.template.$error.maxlength">Your metaDescription cannot be longer than 256 characters</small>
                                    <small class="error" ng-show="pageForm.template.$error.serverSide">{{ serverErrors.template }}</small>
                                </div>
                            </div>
                        <div class="large-12 columns">
                            <label for="">Meta Description</label>
                            <input type="text"
                                   class="form-control"
                                   placeholder="Metatag description for this page"
                                   name="metaDescription"
                                   ng-model="page.metaDescription"
                                   ng-change="change()"
                                   ng-maxlength=256 />
                            <div class="error-container" ng-show="pageForm.metaDescription.$dirty && pageForm.metaDescription.$invalid">
                                <small class="error" ng-show="pageForm.metaDescription.$error.maxlength">Your metaDescription cannot be longer than 256 characters</small>
                                <small class="error" ng-show="pageForm.metaDescription.$error.serverSide">{{ serverErrors.metaDescription }}</small>
                            </div>
                        </div>
                    </div>

                </fieldset>

                <hr />
                <button type="submit" class="btn btn-default" ng-disabled="pageForm.$pristine || pageForm.$invalid">Save</button>
            </form>
        </div>
    </div>
{% endblock %}
