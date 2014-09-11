{% if menuItems %}
    {% for menuItem in menuItems %}
        {% include "menu/menuItem.swig" with menuItems %}
    {% endfor %}
{% endif %}