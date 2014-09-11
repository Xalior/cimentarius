{% extends '../layouts/master.swig' %}

{% block hero-block %}
    <div class = "page-header">
        <h1>File Manager</h1>
    </div>
{% endblock %}

{% block content %}
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h5 class = "pull-left">
                <b>Hello, {{ user.get('username') }}!</b>
            </h5>
        </div>
        <div class = "panel-body">

            <span>INCLUDE MAIN GUI HERE</span>
        </div>
    </div>
{% endblock %}

{% block surf-block %}
{% endblock %}