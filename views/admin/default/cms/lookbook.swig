{% extends '../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            Lookbooks
        </h1>
    </div>
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4 class = "pull-left">
                All Lookbooks
            </h4>
            <a class = "pull-right btn btn-primary" href = "/ole/cms/lookbook/create">Create New Lookbook</a>
        </div>
        <div class = "panel-body">
            <table class = "table table-striped table-bordered table-hover">
                <thead>
                    <tr>
                        <th>Cover Image</th>
                        <th>Title</th>
                        <th>URL Key</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {% for lookbook in lookbooks %}
                        <tr>
                            <td>
                                {% if lookbook.get('thumbnailUrl') %}
                                    <img src = "{{ lookbook.get('thumbnailUrl') }}" alt = "Cover Image" class="cover-image-preview"/>
                                {% else %}
                                    No Cover Image
                                {% endif %}
                            </td>
                            <td>{{ lookbook.get('title') }}</td>
                            <td>{{ lookbook.get('url') }}</td>
                            <td>
                                <a href = "/ole/cms/lookbook/update/{{ lookbook.get('id') }}">Edit</a>
                            </td>
                        </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
    </div>
{% endblock %}