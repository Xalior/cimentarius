{% extends '../../layouts/master.swig' %}

{% block content %}
    <div class = "page-header">
        <h1>
            Edit Category
        </h1>
    </div>
    <div class = "row">
        {#<div class = "col-md-9">#}
            <div class = "panel panel-default">
                <div class = "panel-heading">
                    <h4 class = "pull-left">
                        Category Details
                    </h4>
                    <a class = "pull-right btn btn-primary" href = "/ole/magazine/category/">&laquo; Back To All Categories</a>
                </div>
                <div class = "panel-body">
                    <form method = "post" class = "ole-form form-horizontal" role = "form">
                        {{ forms.text(categoryForm, 'title') }}
                        {{ forms.textarea(categoryForm, 'meta_description') }}
                        {{ forms.text(categoryForm, 'slug') }}
                        {% if categoryModel.get('category_image') %}
                            <div class = "form-group">
                                <label class = "col-sm-2 control-label">
                                    Category Image Preview
                                </label>
                                <div class = "col-sm-10">
                                    <img class = "image-preview" src = "{{ categoryModel.get('category_image') }}" alt = "Category Image"/>
                                </div>
                            </div>
                        {% endif %}
                        {{ forms.fileManager(categoryForm, 'category_image') }}
                        {% include '../../filemanager/manager.swig' %}
                        {{ forms.csrf() }}
                        {{ forms.submit('Update Category') }}
                    </form>
                </div>
            </div>
        {#</div>#}
        {#<div class = "col-md-3">#}
            {#<div class = "panel panel-default">#}
                {#<div class = "panel-heading">#}
                    {#<h4>Extras</h4>#}
                {#</div>#}
                {#<div class = "panel-body">#}
                    {#<a href = "/ole/magazine/{{ issueModel.get('id') }}/page/create">#}
                        {#Add Page#}
                    {#</a>#}
                {#</div>#}
            {#</div>#}
        {#</div>#}
    </div>
    {#&#123;&#35; Associated Pages &#35;&#125;#}
    {#<div class = "panel panel-default">#}
        {#<div class = "panel-heading">#}
            {#<h4 class = "pull-left">#}
                {#Associated Pages#}
            {#</h4>#}
        {#</div>#}
        {#<div class = "panel-body">#}
            {#<div class = "sortable-page-table-wrapper">#}
                {#{% include '../page/list.swig' %}#}
            {#</div>#}
            {#<div class="sortable-footer">#}
                {#<a href = "/ole/magazine/reorder/{{ issueModel.get('id') }}" class = "btn btn-sm btn-success save-order">#}
                    {#Save New Order#}
                {#</a>#}
                {#<a href = "#" class = "btn btn-sm btn-danger revert">#}
                    {#Revert#}
                {#</a>#}
            {#</div>#}
        {#</div>#}
    {#</div>#}
{% endblock %}