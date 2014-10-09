{% extends '../layouts/master.swig' %}

{% block content %}
    <div class = "col-md-12">
        <div class = "page-header">
            <h1>
                404 - Resource Not Found
            </h1>
        </div>
    </div>
    <div class="col-md-12">

        <p>{~ err | safe ~}</p>
    </div>
{% endblock %}