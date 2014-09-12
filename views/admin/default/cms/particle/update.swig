{% extends '../../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            Update Particle - {{ particleType }}
        </h1>

        <p>{{ particleDescription }}</p>
    </div>
    {# Form #}
    <form action = "{{ updateParticlePostUrl }}" method = "post" class = "ole-form form-horizontal" role = "form">
        {{ forms.text(particleForm, 'blockName') }}
        {{ forms.select(particleForm, 'template', particle.getTemplateList()) }}
        {{ forms.hidden(particleForm, 'position') }}
        {% include particleTemplateLocation %}
        {{ forms.csrf() }}
        {{ forms.submit('Save Particle', 'btn btn-success') }}
    </form>
    {% include 'liveedit.swig' %}
{% endblock %}