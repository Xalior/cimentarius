{% extends '../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            CMS Pages
        </h1>
    </div>
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4 class = "pull-left">
                All Pages
            </h4>
            <a class = "pull-right btn btn-primary" href = "/ole/cms/page/create">Create New Page</a>
        </div>
        <div class = "panel-body">
            <table class = "table table-bordered">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>URL Key</th>
                        <th>Parent ID</th>
                        <th>Parent Link</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {% for page in pages %}
                        <tr>
                            <td>{{ page.get('title') }}</td>
                            <td>{{ page.get('url') }}</td>
                            <td>
                                {% if page.get('parent_id') %}
                                    {{ page.get('parent_id') }}
                                {% else %}
                                    N/A
                                {% endif %}
                            </td>
                            {% if (page.get('parent_id')) %}
                                <td>
                                    <a href = "{{ page.getParentUrl() }}">View {{ (page.get('parent_type')) | capitalize }}
                                    </a>
                                </td>
                            {% else %}
                                <td></td>
                            {% endif %}
                            <td>
                                <a href = "/ole/cms/page/update/{{ page.get('id') }}">Edit</a>
                            </td>
                        </tr>
                    {% endfor %}
                </tbody>
            </table>
        </div>
    </div>
{% endblock %}