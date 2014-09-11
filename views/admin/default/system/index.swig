{% extends '../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            System Settings & Functions
        </h1>
    </div>
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4 class = "pull-left">
                Functions
            </h4>
        </div>
        <div class = "panel-body">
            <dl>
                <dt><a href = "/ole/system/search-index/reindex">Re-Index Search</a></dt>
                <dd>Re-indexes the particle & page search fields.</dd>
            </dl>
        </div>
    </div>
{% endblock %}