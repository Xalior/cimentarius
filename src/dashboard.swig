{% extends 'layouts/two-column.swig' %}

{% block hero-block %}
    {% include 'partials/messages.swig' %}
{% endblock %}


{% block left-column %}
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4>Statistics</h4>
        </div>
        <div class = "panel-body">
            <span>We'll put some stats here.</span>
        </div>
    </div>
{% endblock %}

{% block right-column %}
    <div class = "panel panel-default">
        <div class = "panel-heading">
            <h4>More Statistics</h4>
        </div>
        <div class = "panel-body">
            <span>And then some more here.</span>
        </div>
    </div>
{% endblock %}

{% block surf-block %}
{% endblock %}