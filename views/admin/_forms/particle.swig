<div ng-controller="particleController" ng-init="init({~particle~})">
    <div class="col-md-8">
        <h1 ng-show="particle.id > 0">Details for '{{ particle.title }}' <small>({{ particle.id }})</small></h1>
        <h1 ng-show="!particle.id">New {{ particle.type }}</h1>

        <tabset justified="true">
            <tab heading="Basic Data">
                <form class="particle-form" name="particleForm" novalidate ng-submit="submit()" method="POST">
                    <fieldset>
                        <legend>Basics</legend>
                        <div class="form-group">
                            <div class="large-12 columns">
                                <label for="title">Title</label>
                                <input type="text"
                                       class="form-control"
                                       placeholder="Particle Title"
                                       name="title"
                                       ng-model="particle.title"
                                       ng-change="change()"
                                       ng-minlength=1
                                       ng-maxlength=64
                                       required />
                                <div class="error-container" ng-show="particleForm.title.$dirty && particleForm.title.$invalid">
                                    <small class="error" ng-show="particleForm.title.$error.required">All particles require a title.</small>
                                    <small class="error" ng-show="particleForm.title.$error.minlength">A particle title is required to be at least 1 characters</small>
                                    <small class="error" ng-show="particleForm.title.$error.maxlength">A particle title cannot be longer than 64 characters</small>
                                    <small class="error" ng-show="particleForm.title.$error.serverSide">{{ serverErrors.title }}</small>
                                </div>
                            </div>
                        </div>
                        {% block basicFormExtras %}{% endblock %}
                    </fieldset>
                    <fieldset>
                        <legend ng-click="showAdvanced = !showAdvanced">Advanced
                                <span class="legend-buttons">
                                    <button type="button" class="btn btn-primary btn-xs" ng-show="showAdvanced">Hide</button>
                                    <button type="button" class="btn btn-primary btn-xs" ng-show="!showAdvanced">Show</button>
                                </span>
                        </legend>
                        <div class="form-group" collapse="!showAdvanced">

                            {% block advancedFormExtras %}{% endblock %}
                            <div class="large-12 columns">
                                <label for="">Particle Template</label>
                                <br />

                                <input type="hidden"
                                       class="form-control"
                                       name="templateName"
                                       ng-value="particle.templateName"/>

                                <div cmt-select ng-model="particle.templateName"
                                       options='{~ particleTemplates ~}'
                                       name="templateName"></div>

                                <div class="error-container" ng-show="particleForm.templateName.$dirty && particleForm.metaDescription.$invalid">
                                    <small class="error" ng-show="particleForm.templateName.$error.serverSide">{{ serverErrors.template }}</small>
                                </div>
                            </div>
                        </div>
                    </fieldset>

                    {% block extraFieldset %}{% endblock %}
                    <hr />
                    <button type="submit" class="btn btn-default" ng-disabled="particleForm.$pristine || particleForm.$invalid">Save</button>
                </form>
            </tab>
            <tab heading="Content" disabled="!particle.id">
                <ul class="content-blocks">
                    <li ng-repeat="contentBlock in particle.template.contentBlocks" class="content-block">
                        <div particle-collection ng-model="contentBlock" particle="particle"></div>
                    </li>
                </ul>
            </tab>
        </tabset>
    </div>
    <div class="col-md-4">
        <div class="particle-header">
            <div class="well">
                <table class="table table-striped">
                    <h2>More Details</h2>
                    <tbody ng-show="!particle.id">
                        <tr>
                            <td>This particle is not yet saved&hellip;</td>
                        </tr>
                    </tbody>
                    <tbody ng-show="particle.id > 0">
                        <tr>
                            <td>id:</td>
                            <td>{{ particle.id }}</td>
                        </tr>
                        <tr>
                            <td>Created At:</td>
                            <td>{{ particle.created_at }}</td>
                        </tr>
                        <tr>
                            <td>Updated At:</td>
                            <td>{{ particle.updated_at }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
