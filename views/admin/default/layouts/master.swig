
{% import '../macros/forms.swig' as forms %}
<!doctype html>
<html ng-app="Cimentarius">
    <head ng-controller="Cimentarius" ng-init="init({
        _adminRoot: '{~ _adminRoot ~}'
    })">
        {% include "../partials/head.swig" %}
    </head>
    <body>
        {% include "../partials/header.swig" %}
        <div class = "container">
            {% include "../partials/messages.swig" %}
            <div class = "row">
                {% block content %}
                    <!-- pre-rendered contented passed into master.swig -->
                    {~ content | safe ~}
                {% endblock %}
            </div>
        </div>
        {% include "../partials/footer.swig" %}
        {% include "../partials/before_body_end.swig" %}
    </body>
</html>