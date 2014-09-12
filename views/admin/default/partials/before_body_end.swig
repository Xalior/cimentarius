<div class = "modal fade" id = "ole-modal">
    <div class = "modal-dialog modal-lg">
        <div class = "modal-content">
            <div class = "modal-header">
                <button type = "button" class = "close" data-dismiss = "modal" aria-hidden = "true">&times;</button>
                <h4 class = "modal-title" id = "ole-modal-title">Modal title</h4>
            </div>
            <div class = "modal-body" id = "ole-modal-body">
                <p>One fine body&hellip;</p>
            </div>
            <div class = "modal-footer">
                <div id = "ole-modal-extra-buttons" class = "pull-left"></div>
                <button type = "button" class = "btn btn-primary">Save changes</button>
            </div>
        </div>
        <!-- /.modal-content -->
    </div>
    <!-- /.modal-dialog -->
</div><!-- /.modal -->
{# CSRF Token #}
<script>
    ole.ajax.initCSRFToken('{{ _csrf }}');
</script>