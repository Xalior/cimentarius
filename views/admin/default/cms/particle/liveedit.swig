<div class = "page-header">
    <h2>
        Preview
    </h2>
</div>

{# Live Edit Pane #}
<div class = "live-edit-preview">
    <h4 class = "no-preview" style = "display: none;">No Preview Available</h4>
</div>

{# Init #}
<script type = "text/javascript">
    var particlePreview;
    $(document).ready(function () {
        {% if particle.livePreview %}
        // Live Preview
        particlePreview = new LivePreview(
                '{{ particleForm.name }}',
                '{{ JSON.stringify(particle.getLivePreviewBindings()) }}',
                '{{ particle.type }}',
                {{ particle.collectLivePreviewData }},
                {{ particle.livePreviewTimeout }},
                $('.live-edit-preview')
        );
        // Init
        particlePreview.init();
        {% else %}
        // No Preview Available
        $('.no-preview').show();
        {% endif %}
    });
</script>