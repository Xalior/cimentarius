{% if menuItem.children %}
<li class = "dropdown">
    <a class = "dropdown-toggle" data-hover = "dropdown" data-delay = "0" data-close-others = "false" href = "{{ menuItem.url }}">
        {{ menuItem.name | safe }}
        <b class="caret"></b>
    </a>
    <ul class = "dropdown-menu">
        {% for menuItem in menuItem.children %}
            {% include "./menuItem.swig" with menuItem %}
        {% endfor %}
    </ul>
    {% else %}
<li>
    <a href = "{{ menuItem.url }}" data-close-others = "false" data-delay = "0">
        {{ menuItem.name | safe }}
    </a>
    {% endif %}
</li>