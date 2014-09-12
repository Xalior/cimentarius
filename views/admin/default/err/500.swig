{% extends '../layouts/master.swig' %}

{% block content %}
    <div class = "col-md-6">
        <div class = "page-header">
            <h1>
                500 - Server Error
            </h1>
        </div>
        <div class="bs-callout bs-callout-danger">
            <h4>Something bad happened!</h4>
            <p>{{ err.message }}</p>
            <p>{{ err.stack }}</p>
        </div>
    </div>
    <div class="col-md-6">

    </div>
{% endblock %}