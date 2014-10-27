<div ng-controller="pageController" ng-init="init({~page~})">
    <div class="col-md-8">
        <h1 ng-show="page.id > 0">Page Details for '{{ page.title }}' <small>({{ page.id }})</small></h1>
        <h1 ng-show="!page.id">New Page</h1>

        <tabset justified="true">
            <tab heading="Settings">
                <form class=page-form" name="pageForm" novalidate ng-submit="submit()" method="POST">
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
                                    <small class="error" ng-show="pageForm.title.$error.required" ng-disabled="page.parent_type=='page'">All pages require a title.</small>
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
                                    <small class="error" ng-show="pageForm.slug.$error.required" ng-disabled="page.parent_type=='site'">Please input a slug</small>
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

                                <input type="hidden"
                                       class="form-control"
                                       name="templateName"
                                       ng-value="page.templateName"/>

                                <div cmt-select ng-model="page.templateName"
                                       options='{~ pageTemplates ~}'
                                       name="templateName"></div>

                                <div class="error-container" ng-show="pageForm.templateName.$dirty && pageForm.metaDescription.$invalid">
                                    <small class="error" ng-show="pageForm.templateName.$error.serverSide">{{ serverErrors.template }}</small>
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
            </tab>
            <tab heading="Content" disabled="!page.id">
                <ul class="content-blocks">
                    <li ng-repeat="contentBlock in page.template.contentBlocks" class="content-block">
                        <div particle-collection ng-model="contentBlock" page="page"></div>
                    </li>
                </ul>
            </tab>
        </tabset>
    </div>
    <div class="col-md-4">
        <div class="page-header">
            <div class="well">
                <table class="table table-striped">
                    <h2>More Details</h2>
                    <tbody ng-show="!page.id">
                        <tr>
                            <td>This page is not yet saved&hellip;</td>
                        </tr>
                    </tbody>
                    <tbody ng-show="page.id > 0">
                        <tr>
                            <td>id:</td>
                            <td>{{ page.id }}</td>
                        </tr>
                        <tr>
                            <td>Created At:</td>
                            <td>{{ page.created_at }}</td>
                        </tr>
                        <tr>
                            <td>Updated At:</td>
                            <td>{{ page.updated_at }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
