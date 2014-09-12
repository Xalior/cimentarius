{% extends '../layouts/master.swig' %}

{% block content %}
    <div class = "col-md-6">
        <div class = "page-header">
            <h1>
                401 - Unauthorised Access
            </h1>
        </div>
        <p>You don't have permission to view this page.</p>
        <p>Please contact your system administrator.</p>
    </div>
    <div class="col-md-6">
        <img src = "/ole/images/errors/401/notworthy.gif" alt = "Not Worthy"/>
    </div>
{% endblock %}