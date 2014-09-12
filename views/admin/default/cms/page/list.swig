<table class = "table table-striped table-bordered table-hover">
    <thead>
        <tr>
            <th>Template Name</th>
            <th>Title</th>
            <th>Url</th>
            <th>Categories</th>
            <th>Follow On</th>
            <th>Publish Status</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody>
        {% for page in pages %}
            <tr id="page-{{ page.get('id') }}">
                <td>{{ page.attributes.templateName|replace('_', ' ', 'g')|title }}</td>
                <td>{{ page.get('title') }}</td>
                <td>{{ page.get('url') }}</td>
                <td>
                    {% if page.get('category_list') %}
                        {{ page.get('category_list') }}
                    {% else %}
                        No Categories
                    {% endif %}
                </td>
                <td>
                    {% if page.get('follow_on') %}
                        <span class="follow_on">Yes</span>
                    {% else %}
                        <span class="not_follow_on">No</span>
                    {% endif %}
                </td>
                <td>
                    {% if page.get('published') %}
                        <span class="published">Yes</span>
                    {% else %}
                        <span class="unpublished">No</span>
                    {% endif %}
                </td>
                <td>
                    <a href = "/ole/cms/page/update/{{ page.get('id') }}">Edit</a>
                </td>
            </tr>
        {% endfor %}
    </tbody>
</table>