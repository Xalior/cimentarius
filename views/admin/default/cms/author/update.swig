{% extends '../../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            Update Existing Content Author
        </h1>
    </div>
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4 class = "pull-left">
                Update Author Details
            </h4>
            <a class = "pull-right btn btn-primary" href = "/ole/cms/author/">&laquo; Back To All Authors</a>
        </div>
        <div class = "panel-body">
            <form method = "post" class = "ole-form form-horizontal" role = "form" enctype="multipart/form-data">
                {{ forms.text(authorForm, 'display_name') }}
                {{ forms.fileManager(authorForm, 'avatar_url') }}
                {{ forms.textarea(authorForm, 'blurb') }}
                {{ forms.select(authorForm, 'page_id', pageSelectDataSource) }}
                {{ forms.csrf() }}
                {{ forms.submit('Update Author') }}
                {# File Manager Partial #}
                {% include '../../filemanager/manager.swig' %}
            </form>
        </div>
    </div>
{% endblock %}