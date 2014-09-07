<!doctype html>
<html>
    <head>
        {% include "../partials/head.swig" %}
    </head>
    <body>
        {% include "../partials/header.swig" %}
        <div class = "container">
            {% include "../partials/messages.swig" %}
            <div class = "row">
                {% block left-menu %}
                    {% include "../partials/left-menu.swig" %}
                {% endblock %}
                {% block content %}
                    Default Content
                {% endblock %}
            </div>
        </div>
        {% include "../partials/footer.swig" %}
        {% include "../partials/before_body_end.swig" %}
    </body>
</html>