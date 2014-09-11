
{% import '../macros/forms.swig' as forms %}
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
                {% block content %}{% endblock %}
            </div>
        </div>
        {% include "../partials/footer.swig" %}
        {% include "../partials/before_body_end.swig" %}
    </body>
</html>