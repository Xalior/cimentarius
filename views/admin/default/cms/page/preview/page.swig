{% extends '../../../layouts/iframe.swig' %}
{% block content %}
    <div class = "page-main content-block-preview-container">
        <div class="std">
            <div id = "magazine-viewer">
                <div class = "page-wrapper">
                    {{ blockHtml | safe }}
                </div>
            </div>
        </div>
    </div>
{% endblock %}