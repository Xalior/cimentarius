<!doctype html>
<html>
    <head>
        {% include "../partials/head.swig" %}
    </head>
    <body>
        <div class = "container">
            {% include "../partials/messages.swig" %}
            {% block content %}{% endblock %}
            {% include "../partials/before_body_end.swig" %}
        </div>
    </body>
</html>