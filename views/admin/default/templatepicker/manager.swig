<script>

    function __modal_template_selectTrigger(templateField, inModal) {

        var currentSelection = templateField.val();
        templatepicker.receiver = templateField;

        $(".template-option").on('click', function (e) {
            var $this = $(this);
            templateField.val($this.attr('id'));
            $this.closest('.modal').modal('hide');
        });

        if (!inModal) {
            $("#ole-modal").modal('show');
        }
    }
</script>