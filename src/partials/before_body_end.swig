<!-- Modal -->
<div class="modal fade" id="defaultModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="defaultModalTitle">Modal title</h4>
            </div>
            <div class="modal-body" id="defaultModalBody"></div>
            <div class="modal-footer">
                <div id="defaultModalExtraButtons" class="pull-left"></div>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
<script type = "text/javascript" src="/js/admin/cimentarius.js"></script>
<script>
    var CSRF_HEADER = 'X-CSRF-Token';

    var setCSRFToken = function(securityToken) {
        $.ajaxPrefilter(function(options, _, xhr) {
            if ( !xhr.crossDomain )
                xhr.setRequestHeader(CSRF_HEADER, securityToken);
        });
    };

    setCSRFToken('{{_csrf}}');
</script>
