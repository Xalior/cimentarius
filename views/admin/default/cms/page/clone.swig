{% extends '../../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            {{ action }} CMS Page
        </h1>
    </div>
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4 class = "pull-left">
                {{ action }} Page '{{ pageModel.get('title') }}'
            </h4>
            <a class = "pull-right btn btn-primary" href = "/ole/cms/page/update/{{ pageModel.get('id') }}">&laquo; Back to Edit Page</a>
        </div>
        <div class = "panel-body">
            <form method = "post" class = "ole-form form-horizontal" role = "form">
                {{ forms.select(cloneForm, 'parent_id', parentList) }}
                {{ forms.submit(action) }}
                {{ forms.csrf() }}
            </form>
        </div>
    </div>
{% endblock %}