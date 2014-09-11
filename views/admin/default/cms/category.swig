{% extends '../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            Magazine Categories
        </h1>
    </div>
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4 class = "pull-left">
                All Categories - Drag and Drop To Re-Order
            </h4>
            <a class = "pull-right btn btn-primary" href = "/ole/category/create">Create New Category</a>
        </div>
        <div class = "panel-body">
            <div class="sortable-table-wrapper">
                <table class = "table table-bordered">
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Title</th>
                            <th>Slug / Url Key</th>
                            <th>Entries</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {% for category in categories %}
                            <tr id="category-{{ category.get('id') }}">
                                <td>{{ category.get('id') }}</td>
                                <td>{{ category.get('title') }}</td>
                                <td>{{ category.get('slug') }}</td>
                                <td>{{ category.attributes.entries|default(0) }}</td>
                                <td>{{ category.attributes.created_at | date('d/m/Y') }}</td>
                                <td>{{ category.attributes.updated_at | date('d/m/Y') }}</td>
                                <td>
                                    <a href = "/ole/category/update/{{ category.get('id') }}">Edit</a>
                                </td>
                                <td>
                                    <a href = "/ole/category/delete/{{ category.get('id') }}" class="text-danger">Delete</a>
                                </td>
                            </tr>
                        {% endfor %}
                    </tbody>
                </table>
            </div>
            <div class = "sortable-footer">
                <a href = "/ole/category/reorder" class = "btn btn-sm btn-success save-order">
                    Save New Order
                </a>
                <a href = "#" class = "btn btn-sm btn-danger revert">
                    Revert
                </a>
            </div>
        </div>
    </div>
    {# Script #}
    <script type = "text/javascript">
        $(document).ready(function () {
            ole.magazine.initSortableObjectList('categories');
        });
    </script>
{% endblock %}