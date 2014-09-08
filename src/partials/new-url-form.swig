<div class = "modal-dialog">
    <div class = "modal-content">
        <div class = "modal-header">
            <h1 class = "text-center">Create New Shortcut</h1>
        </div>
        <div class = "modal-body">
            <form class = "form col-md-12 center-block" method="post" action="/*">
                <div class = "form-group">
                    <label for="labelUrl">Destination URL</label>

                    <input type = "text" class = "form-control input-lg" placeholder = "Destination URL" name="target">
                </div>
                <div class = "form-group">
                    <label for="labelTitle">Shortcut Title</label>
                    <input type = "text" class = "form-control input-lg" placeholder = "Shortcut Title" name="title">
                </div>
                <div class = "form-group">
                    <label for="labelSlug">Desired Slug <sup class="label-info">* optional</sup></label>
                    <input type = "text" class = "form-control input-lg" placeholder = "Desired Slug" name="slug">
                </div>
                <div class = "form-group">
                    <button class = "btn btn-primary btn-lg btn-block">Create</button>
                </div>
                <input type = "hidden" name="_csrf" value="{{_csrf}}"/>
            </form>
        </div>
    </div>
</div>
