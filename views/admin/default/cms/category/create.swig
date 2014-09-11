{% extends '../../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            Create New Category
        </h1>
    </div>
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4 class = "pull-left">
                New Category Details
            </h4>
            <a class = "pull-right btn btn-primary" href = "/ole/magazine/category/">&laquo; Back To All Categories</a>
        </div>
        <div class = "panel-body">
            <form method = "post" class = "ole-form form-horizontal" role = "form" enctype="multipart/form-data">
                {{ forms.text(categoryForm, 'title') }}
                {{ forms.textarea(categoryForm, 'meta_description') }}
                {{ forms.text(categoryForm, 'slug') }}
                {{ forms.fileManager(categoryForm, 'category_image') }}
                {{ forms.csrf() }}
                {{ forms.submit('Create New Category') }}
                {# File Manager Partial #}
                {% include '../../filemanager/manager.swig' %}
            </form>
        </div>
    </div>
{% endblock %}