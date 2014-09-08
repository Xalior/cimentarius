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
        <div class="col-md-6">
            {% block left-column %}
                Default Left Column Content
            {% endblock %}
        </div>
        <div class="col-md-6">
            {% block right-column %}
                Default Right Column Content
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