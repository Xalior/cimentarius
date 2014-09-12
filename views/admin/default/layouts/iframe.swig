
{% import '../macros/forms.swig' as forms %}
<!doctype html>
<html>
    <head>
        {% include "../partials/head.swig" %}
    </head>
    <body>
        <div class = "container">
            <div class = "row">
                {% block content %}{% endblock %}
            </div>
        </div>
        {% include "../partials/before_body_end.swig" %}
    </body>
</html>