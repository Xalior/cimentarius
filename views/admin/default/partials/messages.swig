{% if messageHtml %}
    <div class = "alert-container">
        {{ messageHtml | safe }}
    </div>
{% endif %}