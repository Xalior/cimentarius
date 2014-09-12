{% extends '../../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            Delete Particle
        </h1>
    </div>
    <div class = "col-md-12">
        <div class = "panel panel-default">
            <div class = "panel-heading">
                <h4 class = "pull-left">
                    Delete Particle - {{ particle.get('name') }}
                </h4>
                <a class = "pull-right btn btn-primary" href = "/ole/cms/page/update/{{ particle.get('page_id') }}">&laquo; Return to page</a>
            </div>
            <div class = "panel-body">
                <form method = "post" class = "ole-form form-horizontal" role = "form">
                    {{ forms.csrf() }}
                    <div class = "text-center">
                        <p class="lead">Are you sure?</p>
                        <p>
                            <input type = "submit" value = "Delete Particle" class = "btn btn-danger"/>
                            <a href = "/ole/cms/page/update/{{ particle.get('page_id') }}" class = "btn btn-primary">No! Don't Delete!</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    </div>
{% endblock %}