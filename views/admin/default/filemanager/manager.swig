<script>

    var pathPrefix = '{{ fileManagerPrefix }}';
    function __modal_image_loadTrigger(jEl, inModal) {

        var path = jEl.val();
        var pathArray = path.split("/");
        console.log('1: ' + pathArray);

        if (pathArray[0] !== 'http:' && pathArray[0] !== 'https:') {
            if ((pathArray.length >= 2) && ((('/' + pathArray[1]) == pathPrefix)) || pathArray[1] == pathPrefix) {
                pathArray.splice(0, 2);
                pathArray.unshift('');
            }

            if ((pathArray.length > 1) && (pathArray[pathArray.length - 1] != '')) {
                console.log("bad path");
                pathArray.pop();
                path = pathArray.join('/') + '/';
            } else {
                console.log(pathArray.length);
                console.log(pathArray[pathArray.length - 1]);
            }
        }
        else {
            console.log("http path");
            path = '';
        }

        console.log('2: ' + path);

        if (inModal) {
            modalfilemanager.receiver = jEl;
        }
        else {
            filemanager.receiver = jEl;
        }

        $("#ole-modal-title").html('What image do you want to use?');
        $(".file-list button[data-toggle='tooltip']").tooltip();

        $(".file-list button.btn.btn-primary").on('click', function (e) {
            filemanager.goToParent();
        });

        if (!inModal) {
            $("#ole-modal").modal('show');
        }

        if (path.startsWith('/')) {
            if (inModal) {
                modalfilemanager.load(path);
            }
            else {
                filemanager.load(path);
            }
        } else {
            if (inModal) {
                modalfilemanager.load("/");
            }
            else {
                filemanager.load("/");
            }
        }
    }
</script>