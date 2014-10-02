{% extends '../layouts/master.swig' %}

{% block content %}
    <div class="col-md-8">
        <div ng-controller="pageController">
            <div class="page-header">
                <h1>Page Details</h1>
            </div>
            <form name="pageForm" novalidate ng-submit="submit()">
                <h4>Basics</h4>
                <div class="row">
                    <div class="large-12 columns">
                        <label for="title">Title</label>
                        <input type="text"
                               class="form-control"
                               placeholder="Page Title"
                               name="title"
                               ng-model="page.title"
                               ng-minlength=1
                               ng-maxlength=64
                               required />
                        <div class="error-container" ng-show="pageForm.title.$dirty && pageForm.title.$invalid">
                            <small class="error" ng-show="pageForm.title.$error.required">All pages require a title.</small>
                            <small class="error" ng-show="pageForm.title.$error.minlength">A page title is required to be at least 1 characters</small>
                            <small class="error" ng-show="pageForm.title.$error.maxlength">A page title cannot be longer than 64 characters</small>
                            <small class="error" ng-show="pageForm.title.$error.serverSide">::SEVERE SERVER SEVER::</small>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="large-12 columns">
                        <label for="slug">Slug</label>
                        <input type="text"
                               class="form-control"
                               placeholder="URL for this page"
                               name="slug"
                               ng-model="page.slug"
                               ng-minlength=1
                               ng-maxlength=64
                               required />
                        <div class="error-container" ng-show="pageForm.slug.$dirty && pageForm.slug.$invalid">
                            <small class="error" ng-show="pageForm.slug.$error.required">Please input a slug</small>
                            <small class="error" ng-show="pageForm.slug.$error.minlength">Your username is required to be at least 1 characters</small>
                            <small class="error" ng-show="pageForm.slug.$error.maxlength">Your username cannot be longer than 64 characters</small>
                            <small class="error" ng-show="pageForm.slug.$error.unique">That slug is already used at this level, please try another</small>
                        </div>
                    </div>
                </div>

                <hr />
                <button type="submit" popover="I have a title!" popover-title="The title." class="btn btn-default">title</button>

                </fieldset>
            </form>
        </div>
    </div>
{% endblock %}
