{% extends '../particle.swig' %}

{% block basicFormExtras %}
    <div class="form-group" xmlns="http://www.w3.org/1999/html">
        <div class="large-12 columns">
            <label for="body">Text Body</label>
            <textarea type="textarea"
                   class="form-control"
                   placeholder="Bodytext"
                   name="body"
                   ng-model="particle.body"
                   ng-change="change()"
                   ng-minlength=1
                   required /></textarea>
            <div class="error-container" ng-show="particleForm.body.$dirty && particleForm.body.$invalid">
                <small class="error" ng-show="particleForm.body.$error.required">Text particles require a body.</small>
                <small class="error" ng-show="particleForm.body.$error.minlength">A text particle body is required to be at least 1 characters</small>
                <small class="error" ng-show="particleForm.body.$error.serverSide">{{ serverErrors.title }}</small>
            </div>
        </div>
    </div>
{% endblock %}


{% block advancedFormExtras %}
    ADVANCED HELLO
{% endblock %}