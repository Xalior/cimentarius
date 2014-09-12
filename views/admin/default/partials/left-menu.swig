<div class = "col-md-3">
    <div class = "page-header">
        <h1>Menu</h1>
    </div>
    {% if menuItems %}
    <ul class = "list-unstyled">
        {% for menuItem in menuItems %}
            {% include "menu/menuItem.swig" with menuItems %}
        {% endfor %}
    </ul>
    {% endif %}
</div>