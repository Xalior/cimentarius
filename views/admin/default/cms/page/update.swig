{% extends '../../layouts/master.swig' %}

{% block content %}
    <div class = "row">
        <div class = "page-header">
            <h1>
                Edit CMS Page
            </h1>
        </div>

        <form method = "post" class = "ole-form form-horizontal" role = "form">
            <div class = "col-md-9">

                <div class = "panel panel-default">
                    <div class = "panel-heading">
                        <h4 class = "pull-left">
                            Page Details
                        </h4>
                        <a class = "pull-right btn btn-primary" href = "/ole/cms/page">&laquo; Back to All Pages</a>
                        {% if parentUrl %}
                            <a class = "pull-right btn btn-default" href = "{{ parentUrl }}">Go To Parent {{ parentType | capitalize }}</a>
                        {% endif %}
                        <a class = "pull-right btn btn-primary preview-page" href = "/ole/cms/page/{{ currentPageId }}/preview">Preview Page</a>
                    </div>
                    <div class = "panel-body">
                        <ul class = "nav nav-tabs">
                            <li class = "active">
                                <a href = "#content" data-toggle = "tab">Page Content</a>
                            </li>
                            <li>
                                <a href = "#details" data-toggle = "tab">Page Details</a>
                            </li>
                        </ul>

                        <div class = "tab-content">
                            {# Content Tab #}
                            <div class = "tab-pane active" id = "content">
                                {% include 'content.swig' %}
                            </div>

                            {# Details Tab #}
                            <div class = "tab-pane" id = "details">
                                {% if parentType and parentTitle %}
                                    <div class = "form-group">
                                        <label class = "col-sm-3 control-label">Parent Type:</label>
                                        <div class = "col-sm-9">
                                            <input type = "text" class = "form-control disabled" value = "{{ parentType | title }}" disabled = "disabled"/>
                                        </div>
                                    </div>
                                    <div class = "form-group">
                                        <label class = "col-sm-3 control-label">Parent:</label>
                                        <div class = "col-sm-9">

                                            <div class="input-group" id="parent-original">
                                                <input type = "text" class = "form-control disabled" value = "{{ parentTitle }}" disabled = "disabled"/>
                                                <span class="input-group-btn">
                                                    <button id="parent-change-trigger" class="btn btn-primary" type="button">Change&hellip;</button>
                                                </span>
                                                <input type = "hidden" class = "form-control" id="parent_id_original" name = "parent_id_original"  value = "{{ parentId }}">
                                            </div>
                                            {% if parents.length > 0 %}
                                                <div class="input-group" id="parent-change">
                                                    <select id="parent_id_change" name = "{{ pageForm.fieldIdentifier('parent_id') }}" class = "form-control">
                                                        {% for parent in parents %}
                                                            {% if pageForm.parent_id and pageForm.parent_id == parent.id %}
                                                            <option value = "{{ parent.id }}" selected = "selected">
                                                            {% elseif not pageForm.parent_id and parentId == parent.id %}
                                                                <option value = "{{ parent.id }}" selected = "selected">
                                                            {% else %}
                                                                <option value = "{{ parent.id }}">
                                                            {% endif %}
                                                            {{ parent.get('title') }}
                                                            </option>
                                                        {% endfor %}
                                                    </select>
                                                    <span class="input-group-btn">
                                                        <button id="parent-change-cancel" class="btn btn-primary" type="button">Cancel&hellip;</button>
                                                    </span>
                                                </div>
                                            {% endif %}
                                        </div>
                                    </div>
                                {% endif %}

                                {{ forms.pageTemplatePreview(pageForm, 'templateName', templates) }}
                                {% include '../../templatepicker/manager.swig' %}

                                <div class = "form-group {% if pageForm.getErrorsForField('title').length %}has-feedback has-error{% endif %}">
                                    <label class = "col-sm-3 control-label" for = "{{ pageForm.fieldIdentifier('title') }}">{{ pageForm.getLabelText('title') }}</label>
                                    <div class = "col-sm-9">
                                        <input type = "text" class = "form-control" name = "{{ pageForm.fieldIdentifier('title') }}" placeholder = "{{ pageForm.getLabelText('title') }}" value = "{{ pageForm.title }}">
                                        {% if pageForm.getErrorsForField('title').length %}
                                            <span class = "glyphicon glyphicon-remove form-control-feedback"
                                                  data-toggle = "popover"
                                                  data-original-title = "{{ pageForm.getLabelText('title') }}"
                                                  data-content = "{{ pageForm.getErrorsForField('title') }}"></span>
                                        {% endif %}
                                    </div>
                                </div>
                                <div class = "form-group {% if pageForm.getErrorsForField('url').length %}has-feedback has-error{% endif %}">
                                    <label class = "col-sm-3 control-label" for = "{{ pageForm.fieldIdentifier('url') }}">{{ pageForm.getLabelText('url') }}</label>
                                    <div class = "col-sm-9">
                                        <input type = "text" class = "form-control" name = "{{ pageForm.fieldIdentifier('url') }}" placeholder = "{{ pageForm.getLabelText('url') }}" value = "{{ pageForm.url }}">
                                        {% if pageForm.getErrorsForField('url').length %}
                                            <span class = "glyphicon glyphicon-remove form-control-feedback"
                                                  data-toggle = "popover"
                                                  data-original-title = "{{ pageForm.getLabelText('url') }}"
                                                  data-content = "{{ pageForm.getErrorsForField('url') }}"></span>
                                        {% endif %}
                                    </div>
                                </div>
                                <div class = "form-group {% if pageForm.getErrorsForField('published').length %}has-feedback has-error{% endif %}">
                                    <label class = "col-sm-3 control-label" for = "{{ pageForm.fieldIdentifier('published') }}">{{ pageForm.getLabelText('published') }}</label>
                                    <div class = "col-sm-9">
                                        {{ forms.selectInput(pageForm, 'published', {0: 'No', 1: 'Yes'}) }}
                                        {% if pageForm.getErrorsForField('published').length %}
                                            <span class = "glyphicon glyphicon-remove form-control-feedback"
                                                  data-toggle = "popover"
                                                  data-original-title = "{{ pageForm.getLabelText('published') }}"
                                                  data-content = "{{ pageForm.getErrorsForField('published') }}"></span>
                                        {% endif %}
                                    </div>
                                </div>

                                <div class = "form-group">
                                    <div class = "col-sm-9 pull-right">
                                        <a href ="#advanced" data-toggle="slidedown" class = "btn btn-sm btn-warning">Advanced Settings</a>
                                    </div>
                                </div>
                                {# Advanced Slidedown #}
                                <div class = "slidedown-pane" id = "advanced">
                                    <div class = "form-group {% if pageForm.getErrorsForField('follow_on').length %}has-feedback has-error{% endif %}">
                                        <label class = "col-sm-3 control-label" for = "{{ pageForm.fieldIdentifier('follow_on') }}">{{ pageForm.getLabelText('follow_on') }}</label>
                                        <div class = "col-sm-9">
                                            {{ forms.selectInput(pageForm, 'follow_on', {0: 'No', 1: 'Yes'}) }}
                                            {% if pageForm.getErrorsForField('follow_on').length %}
                                                <span class = "glyphicon glyphicon-remove form-control-feedback"
                                                      data-toggle = "popover"
                                                      data-original-title = "{{ pageForm.getLabelText('follow_on') }}"
                                                      data-content = "{{ pageForm.getErrorsForField('follow_on') }}"></span>
                                            {% endif %}
                                        </div>
                                    </div>
                                    <div class = "form-group {% if pageForm.getErrorsForField('article_image').length %}has-feedback has-error{% endif %}">
                                        <div class = "col-sm-12">
                                            {{ forms.pageFileManager(pageForm, 'article_image') }}
                                            {% if pageForm.getErrorsForField('article_image').length %}
                                                <span class = "glyphicon glyphicon-remove form-control-feedback"
                                                      data-toggle = "popover"
                                                      data-original-title = "{{ pageForm.getLabelText('article_image') }}"
                                                      data-content = "{{ pageForm.getErrorsForField('article_image') }}"></span>
                                            {% endif %}
                                        </div>
                                    </div>
                                    {% include '../../filemanager/manager.swig' %}
                                    <div class = "form-group {% if pageForm.getErrorsForField('cover_title').length %}has-feedback has-error{% endif %}">
                                        <label class = "col-sm-3 control-label" for = "{{ pageForm.fieldIdentifier('cover_title') }}">{{ pageForm.getLabelText('cover_title') }}</label>
                                        <div class = "col-sm-9">
                                            {{ forms.textInput(pageForm, 'cover_title') }}
                                            {% if pageForm.getErrorsForField('cover_title').length %}
                                                <span class = "glyphicon glyphicon-remove form-control-feedback"
                                                      data-toggle = "popover"
                                                      data-original-title = "{{ pageForm.getLabelText('cover_title') }}"
                                                      data-content = "{{ pageForm.getErrorsForField('cover_title') }}"></span>
                                            {% endif %}
                                        </div>
                                    </div>
                                    <div class = "form-group {% if pageForm.getErrorsForField('cover_summary').length %}has-feedback has-error{% endif %}">
                                        <label class = "col-sm-3 control-label" for = "{{ pageForm.fieldIdentifier('cover_summary') }}">{{ pageForm.getLabelText('cover_summary') }}</label>
                                        <div class = "col-sm-9">
                                            {{ forms.textInput(pageForm, 'cover_summary') }}
                                            {% if pageForm.getErrorsForField('cover_summary').length %}
                                                <span class = "glyphicon glyphicon-remove form-control-feedback"
                                                      data-toggle = "popover"
                                                      data-original-title = "{{ pageForm.getLabelText('cover_summary') }}"
                                                      data-content = "{{ pageForm.getErrorsForField('cover_summary') }}"></span>
                                            {% endif %}
                                        </div>
                                    </div>
                                    <div class = "form-group {% if pageForm.getErrorsForField('metaDescription').length %}has-feedback has-error{% endif %}">
                                        <label class = "col-sm-3 control-label" for = "{{ pageForm.fieldIdentifier('metaDescription') }}">{{ pageForm.getLabelText('metaDescription') }}</label>
                                        <div class = "col-sm-9">
                                            <textarea name = "{{ pageForm.fieldIdentifier('metaDescription') }}" class = "form-control" placeholder = "{{ pageForm.getLabelText('metaDescription') }}">{{ pageForm.metaDescription }}</textarea>
                                            {% if pageForm.getErrorsForField('metaDescription').length %}
                                                <span class = "glyphicon glyphicon-remove form-control-feedback"
                                                      data-toggle = "popover"
                                                      data-original-title = "{{ pageForm.getLabelText('metaDescription') }}"
                                                      data-content = "{{ pageForm.getErrorsForField('metaDescription') }}"></span>
                                            {% endif %}
                                        </div>
                                    </div>
                                </div>
                                <input type = "hidden" name = "_csrf" value = "{{ _csrf }}"/>
                                <div class = "form-group">
                                    <div class = "col-sm-9 pull-right">
                                        <input type = "submit" value = "Update Page" class = "btn btn-default"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class = "col-md-3">
                {# Extras #}
                <div class = "panel panel-default">
                    <div class = "panel-heading">
                        <h4>Extra Functionality</h4>
                    </div>
                    <div class = "panel-body">
                        <div class = "col-sm-12">
                            <div>
                                <a href = "/ole/cms/page/clone/{{ currentPageId }}">Clone Page</a>
                            </div>
                            <div>
                                <a href = "/ole/cms/page/clone/{{ currentPageId }}/fork">Fork Page</a>
                            </div>
                        </div>
                    </div>
                </div>
                {# Categories #}
                <div class = "panel panel-default">
                    <div class = "panel-heading">
                        <h4>Categories</h4>
                    </div>
                    <div class = "panel-body">
                        <div class = "col-sm-12">
                            {% for category in categories %}
                                <div class = "form-group">
                                    {% if category.get('checked') %}
                                        <input type = "checkbox" value = "{{ category.get('id') }}" name = "category" id = "category_{{ category.get('id') }}" checked = "checked"/>
                                    {% else %}
                                        <input type = "checkbox" value = "{{ category.get('id') }}" name = "category" id = "category_{{ category.get('id') }}"/>
                                    {% endif %}
                                    <label for = "category_{{ category.get('id') }}">
                                        {{ category.get('title') }}
                                    </label>
                                </div>
                            {% endfor %}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <script type = "text/javascript">
        $(document).ready(function () {
            var originalParentField = $('#parent-original');
            var changeParentField = $('#parent-change');

            if (originalParentField.find('#parent_id_original').val() !== changeParentField.find(":selected").val()) {
                originalParentField.hide();
            }
            else {
                changeParentField.hide();
            }

            originalParentField.find('#parent-change-trigger').on('click', function () {
                originalParentField.find('#parent-change-trigger')
                originalParentField.hide();
                changeParentField.show();
            });
            changeParentField.find('#parent-change-cancel').on('click', function () {
                changeParentField.find("#parent_id_change").val(originalParentField.find('#parent_id_original').val());
                changeParentField.hide();
                originalParentField.show();
            });

            ole.page.initPagePreviewLinks();
        });
    </script>
{% endblock %}