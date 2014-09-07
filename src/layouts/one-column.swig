{% extends 'master.swig' %}

{# blow away the left menu #}
{% block left-menu %}
{% endblock %}

{% block content %}

    <div class="row">
        <div class="col-md-12">
            {% block hero-block %}
                Default Hero Block
            {% endblock %}
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            {% block main-column %}
                Default Column Content
            {% endblock %}
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            {% block surf-block %}
                Default Surf Block
            {% endblock %}
        </div>
    </div>
{% endblock %}