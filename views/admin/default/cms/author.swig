{% extends '../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            Content Authors
        </h1>
    </div>
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4 class = "pull-left">
                All Content Authors
            </h4>
            <a class = "pull-right btn btn-primary" href = "/ole/cms/author/create">Create New Author</a>
        </div>
        <div class = "panel-body">
            <table class = "table table-bordered">
                <thead>
                    <tr>
                        <th>Author ID</th>
                        <th>Display Name</th>
                        <th>Avatar Preview</th>
                        <th>Created At</th>
                        <th>Updated At</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {% for author in authorCollection.models %}
                        <tr>
                            <td>{{ author.get('id') }}</td>
                            <td>{{ author.get('display_name') }}</td>
                            <td>
                                <img src = "{{ author.get('avatar_url') }}" alt = "{{ author.get('display_name') }}"/>
                            </td>
                            <td>{{ author.attributes.created_at | date('d/m/Y') }}</td>
                            <td>{{ author.attributes.updated_at | date('d/m/Y') }}</td>
                            <td>
                                <a href = "/ole/cms/author/update/{{ author.get('id') }}">Edit</a>
                            </td>
                            <td>
                                <a href = "/ole/cms/author/delete/{{ author.get('id') }}" class = "text-danger">Delete</a>
                            </td>
                        </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
    </div>
{% endblock %}