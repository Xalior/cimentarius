<div class = "modal-dialog modal-lg">
    <div class = "modal-content">

        <div class = "modal-header">
            <button type = "button" class = "close" data-dismiss = "modal" aria-hidden = "true">×</button>
            <h4 class = "modal-title">{{ modalTitle }}</h4>
        </div>
        <div class = "modal-body">
            {% block content %}
        </div>
    </div>
</div>