{% extends '../../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            Create New CMS Page
        </h1>
    </div>
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4 class = "pull-left">
                Create New Page
            </h4>
            <a class = "pull-right btn btn-primary" href = "/ole/cms/page">&laquo; Back to All Pages</a>
            {% if parentUrl %}
                <a class = "pull-right btn btn-default" href = "{{ parentUrl }}">&laquo; Back To Parent {{ parentType }}</a>
            {% endif %}
        </div>
        <div class = "panel-body">
            <form method = "post" class = "ole-form form-horizontal" role = "form">
                <ul class = "nav nav-tabs">
                    <li class = "active">
                        <a href = "#details" data-toggle = "tab">Page Details</a>
                    </li>
                    <li>
                        <a href = "#advanced" data-toggle = "tab">Advanced Settings</a>
                    </li>
                </ul>
                <div class = "tab-content">
                    <div class = "tab-pane active" id = "details">
                        {% if parentType and parentTitle %}
                            <div class = "form-group">
                                <label class = "col-sm-2 control-label">Parent Type:</label>
                                <div class = "col-sm-10">
                                    <input type = "text" class = "form-control disabled" value = "{{ parentType | title }}" disabled = "disabled"/>
                                </div>
                            </div>
                            <div class = "form-group">
                                <label class = "col-sm-2 control-label">Parent Title:</label>
                                <div class = "col-sm-10">
                                    <input type = "text" class = "form-control disabled" value = "{{ parentTitle }}" disabled = "disabled"/>
                                </div>
                            </div>

                            <input type = "hidden" class = "form-control" name = "{{ pageForm.fieldIdentifier('parent_id') }}"  value = "{{ parentId }}">

                        {% endif %}

                        {{ forms.templatePreview(pageForm, 'templateName', templates) }}

                        {{ forms.text(pageForm, 'title') }}
                        {{ forms.select(pageForm, 'published', {0: 'No', 1: 'Yes'}) }}
                        {{ forms.text(pageForm, 'url') }}
                        {{ forms.csrf() }}
                        {{ forms.submit('Create New Page', 'btn btn-default') }}
                    </div>
                    <div class = "tab-pane" id = "advanced">
                        {{ forms.select(pageForm, 'follow_on', {0: 'No', 1: 'Yes'}) }}
                        {{ forms.fileManager(pageForm, 'article_image') }}
                        {{ forms.text(pageForm, 'cover_title') }}
                        {{ forms.text(pageForm, 'cover_summary') }}
                        {{ forms.textarea(pageForm, 'metaDescription') }}
                    </div>
                </div>
                {# File Manager Partial #}
                {% include '../../filemanager/manager.swig' %}
                {# Template Picker Partial #}
                {% include '../../templatepicker/manager.swig' %}
            </form>
        </div>
    </div>
{% endblock %}