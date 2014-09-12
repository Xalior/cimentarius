{# ---------- #}
{# Text Input #}
{# ---------- #}
{% macro text(formModel, formProperty) %}
    {{ forms.rowWrapper(formModel, formProperty, forms.label(formModel, formProperty), forms.textInput(formModel, formProperty), forms.hint(formModel, formProperty)) }}
{% endmacro %}

{% macro textInput(formModel, formProperty) %}
    <input type = "text" class = "form-control" name = "{{ formModel.fieldIdentifier(formProperty) }}" placeholder = "{{ formModel.getLabelText(formProperty) }}" value = "{{ formModel[formProperty] }}">
{% endmacro %}

{# ---------- #}
{# Date Input #}
{# ---------- #}
{% macro date(formModel, formProperty) %}
    {{ forms.rowWrapper(formModel, formProperty, forms.label(formModel, formProperty), forms.dateInput(formModel, formProperty)) }}
{% endmacro %}

{% macro dateInput(formModel, formProperty) %}
    <input type = "date" class = "form-control" name = "{{ formModel.fieldIdentifier(formProperty) }}" placeholder = "{{ formModel.getLabelText(formProperty) }}" value = "{{ formModel[formProperty] }}">
{% endmacro %}

{# ----------- #}
{# Email Input #}
{# ----------- #}
{% macro email(formModel, formProperty) %}
    {{ forms.rowWrapper(formModel, formProperty, forms.label(formModel, formProperty), forms.emailInput(formModel, formProperty)) }}
{% endmacro %}

{% macro emailInput(formModel, formProperty) %}
    <input type = "email" class = "form-control" name = "{{ formModel.fieldIdentifier(formProperty) }}" placeholder = "{{ formModel.getLabelText(formProperty) }}" value = "{{ formModel[formProperty] }}">
{% endmacro %}

{# ------------ #}
{# Hidden Input #}
{# ------------ #}
{% macro hidden(formModel, formProperty) %}
    <input type = "hidden" name = "{{ formModel.fieldIdentifier(formProperty) }}" id = "{{ formModel.fieldIdentifier(formProperty) }}" value = "{{ formModel[formProperty] }}"/>
{% endmacro %}

{# ----------------- #}
{# File Upload Input #}
{# ----------------- #}
{% macro file(formModel, formProperty) %}
    {{ forms.rowWrapper(formModel, formProperty, forms.label(formModel, formProperty), forms.fileInput(formModel, formProperty), forms.hint(formModel, formProperty)) }}
{% endmacro %}

{% macro fileInput(formModel, formProperty) %}
    <input type = "file" class = "form-control" name = "{{ formModel.fieldIdentifier(formProperty) }}">
{% endmacro %}

{# ---------------------- #}
{# Template Preview Input #}
{# ---------------------- #}
{% macro templatePreview(formModel, formProperty, templates) %}
    {{ forms.rowWrapper(formModel, formProperty, forms.variableLabel(formModel, formProperty, 2), forms.templatePreviewInput(formModel, formProperty, templates, 2, 10), forms.hint(formModel, formProperty)) }}
{% endmacro %}

{% macro pageTemplatePreview(formModel, formProperty, templates) %}
    {{ forms.variableRowWrapper(formModel, formProperty, forms.variableLabel(formModel, formProperty, 3), forms.templatePreviewInput(formModel, formProperty, templates, 3, 9), forms.hint(formModel, formProperty), 3, 9) }}
{% endmacro %}

{% macro templatePreviewInput(formModel, formProperty, templates, labelWidth, inputWidth) %}

    <div class = "input-group">
        <input type = "text" class = "form-control" name = "{{ formModel.fieldIdentifier(formProperty) }}" placeholder = "{{ formModel.getLabelText(formProperty) }}" value = "{{ formModel[formProperty] }}">
        <span class = "input-group-btn">
            <button class = "btn btn-primary" type = "button" data-for = "{{ formModel.fieldIdentifier(formProperty) }}">Browse&hellip;</button>
        </span>
        {% if (formModel.getHintText(formProperty)) %}
            <div class="form-control-hint">
                <span class="form-control-hint-text">{{ formModel.getHintText(formProperty) }}</span>
            </div>
        {% endif %}
    </div>

    <script data-modalBody = "{{ formModel.fieldIdentifier(formProperty) }}" type="text/html">
        <div class="current-template-title">Current Template: <code>{{ formModel.templateName|replace('_', ' ', 'g')|title }}</code></div>
        {% for template in templates %}
            <div id="{{ template.filename }}" class="template-option">
                <img class="template-thumb" src="/{{ template.imgSrc }}" alt="{{ template.filename }}" />
            </div>
        {% endfor %}
    </script>

    <script type = "text/javascript">
        $(document).ready(function () {
            templatepicker.init('{{ formModel.fieldIdentifier(formProperty) }}');
        });
    </script>

{% endmacro %}

{# ------------------ #}
{# File Manager Input #}
{# ------------------ #}
{% macro fileManager(formModel, formProperty) %}
    {{ forms.rowWrapper(formModel, formProperty, forms.variableLabel(formModel, formProperty, 2), forms.fileManagerInput(formModel, formProperty, 2, 10), forms.hint(formModel, formProperty)) }}
{% endmacro %}

{% macro pageFileManager(formModel, formProperty) %}
    {{ forms.variableRowWrapper(formModel, formProperty, forms.variableLabel(formModel, formProperty, 3), forms.fileManagerInput(formModel, formProperty, 3, 9), forms.hint(formModel, formProperty), 3, 9) }}
{% endmacro %}

{% macro fileManagerInput(formModel, formProperty, labelWidth, inputWidth) %}
    <div class = "input-group">
        <input type = "text" class = "form-control" name = "{{ formModel.fieldIdentifier(formProperty) }}" placeholder = "{{ formModel.getLabelText(formProperty) }}" value = "{{ formModel[formProperty] }}">
        <span class = "input-group-btn">
            <button class = "btn btn-primary" type = "button" data-for = "{{ formModel.fieldIdentifier(formProperty) }}">Browse&hellip;</button>
        </span>
        {% if (formModel.getHintText(formProperty)) %}
            <div class="form-control-hint">
                <span class="form-control-hint-text">{{ formModel.getHintText(formProperty) }}</span>
            </div>
        {% endif %}
    </div>
    <script data-modalBody = "{{ formModel.fieldIdentifier(formProperty) }}" type = "text/html">
        <div class = "file-folder">Current Path:
            <code id = "current-path"></code>
        </div>
        <table class = "file-list table table-hover table-responsive">
            <thead>
                <tr>
                    <td class = "type">Type</td>
                    <td class = "name">Name</td>
                    <td class = "datetime">Modified At</td>
                    <td class = "more">Options</td>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    </script>
    <script data-modalExtraButtons = "{{ formModel.fieldIdentifier(formProperty) }}" type = "text/html">
        <div class = "file-list-buttons">
            <button data-dotdot = "{{ formModel.fieldIdentifier(formProperty) }}" class = "btn btn-primary" data-toggle = "tooltip" data-placement = "bottom" title = "" data-original-title = "Parent Folder">
                <span class = "glyphicon glyphicon-arrow-up"></span>
            </button>
            <button data-mkdir = "{{ formModel.fieldIdentifier(formProperty) }}" class = "btn btn-success" data-toggle = "tooltip" data-placement = "bottom" title = "" data-original-title = "New Folder...">
                <span class = "glyphicon glyphicon-folder-open"></span>
            </button>

            <div id = "fileuploader">Upload</div>
        </div>
    </script>
    <script type = "text/javascript">
        $(document).ready(function () {
            filemanager.init('{{ formModel.fieldIdentifier(formProperty) }}');
        });
    </script>
{% endmacro %}

{# ------------------ #}
{# File Manager in Modal Input #}
{# ------------------ #}

{% macro modalFileManager(formObject, modalId) %}
    <div class="modal-hidden-page" style="display: none;">
        <input type="button" value="back" id="{{ formObject }}-modal-back" class="modal-back-button btn btn-danger" />
        <div id="{{ formObject }}-modal-page">
            <div class="file-folder">Current Path:
                <code class="current-path"></code>
            </div>
            <table class = "file-list table table-hover table-responsive">
                <thead>
                <tr>
                    <td class = "type">Type</td>
                    <td class = "name">Name</td>
                    <td class = "datetime">Modified At</td>
                    <td class = "more">Options</td>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <div class = "modal-page-footer">
            <div id="{{ formObject }}-modal-page-extra-buttons">
                <div class = "file-list-buttons">
                    <button data-dotdot = "{{ formObject }}" class = "btn btn-primary" data-toggle = "tooltip" data-placement = "bottom" title = "" data-original-title = "Parent Folder">
                        <span class = "glyphicon glyphicon-arrow-up"></span>
                    </button>
                    <button data-mkdir = "{{ formObject }}" class = "btn btn-success" data-toggle = "tooltip" data-placement = "bottom" title = "" data-original-title = "New Folder...">
                        <span class = "glyphicon glyphicon-folder-open"></span>
                    </button>

                    <div class="fileuploader">Upload</div>
                </div>
            </div>
        </div>

    </div>

    <script type = "text/javascript">
        $(document).ready(function () {
            modalfilemanager.init('{{ formObject }}', '{{ modalId }}');
        });
    </script>
{% endmacro %}

{% macro modalFileManagerInput(formProperty, formLabel, inputValue) %}
    {{ variableFileManagerInput(formProperty, formLabel, inputValue, 2, 10) }}
{% endmacro %}


{% macro variableFileManagerInput(formProperty, formLabel, inputValue, labelCol, inputCol) %}
    <div class = "form-group ">
        <label class = "col-sm-{{ labelCol }} control-label">
            {{ formLabel }} - {{ inputValue }}:
        </label>
        <div class="col-sm-{{ inputCol }}">
            <div class = "input-group">
                <input type = "text" class = "form-control {{ formProperty }}-input" name = "{{ formProperty }}" placeholder = "{{ formLabel }}" value = "{{ inputValue }}">
                <span class = "input-group-btn">
                    <button class = "btn btn-primary img-browse-btn" type = "button" data-for = "{{ formProperty }}">Browse&hellip;</button>
                </span>
            </div>
        </div>
    </div>

{% endmacro %}

{# --------------- #}
{# Text Area Input #}
{# --------------- #}
{% macro textarea(formModel, formProperty) %}
    {{ forms.rowWrapper(formModel, formProperty, forms.label(formModel, formProperty), forms.textAreaInput(formModel, formProperty), forms.hint(formModel, formProperty)) }}
{% endmacro %}

{% macro textAreaInput(formModel, formProperty) %}
    <textarea class = "form-control" name = "{{ formModel.fieldIdentifier(formProperty) }}" id = "{{ formModel.fieldIdentifier(formProperty) }}" placeholder="{{ formModel.getLabelText(formProperty) }}">{{ formModel[formProperty] }}</textarea>
{% endmacro %}

{# --------------- #}
{# Markdown Input #}
{# --------------- #}
{% macro markdown(formModel, formProperty) %}
    {{ forms.rowWrapper(formModel, formProperty, forms.label(formModel, formProperty), forms.markdownInput(formModel, formProperty), forms.hint(formModel, formProperty)) }}
{% endmacro %}

{% macro markdownInput(formModel, formProperty) %}
    <div class = "markdown-editor" id = "{{ formModel.fieldIdentifier(formProperty) }}_editable">
        {{ formModel[formProperty] | safe }}</div>
    <input type = "hidden" name = "{{ formModel.fieldIdentifier(formProperty) }}"
           id = "{{ formModel.fieldIdentifier(formProperty) }}" value = "{{ formModel[formProperty] }}"/>
    <script>
        jQuery(document).ready(function () {
            // Enable Hallo editor
            var $editor = jQuery('#{{ formModel.fieldIdentifier(formProperty) }}_editable');
            var $formField = jQuery('#{{ formModel.fieldIdentifier(formProperty) }}');

            $editor.hallo({
                plugins: {
                    'halloformat': {},
                    'halloheadings': {},
                    'hallolink': {},
                    'hallolists': {},
                    'halloreundo': {},
                    'hallofontfamily': {},
                    'hallofontsize': {},
                    'hallofontcolour': {}
                },
                toolbar: 'halloToolbarFixed'
            });

            // Method that converts the HTML contents to Markdown
            var updateForm = function (content) {
                var markdown = ole.particle.text.toMarkdown(content);
                if ($editor.val == markdown) {
                    return;
                }
                $formField.val(
                    ole.particle.text.toHtml(markdown.replace(/<(?!\/span|br)(?!span|br)\/?[^>]+(>|$)/g, ""))
                ).trigger('change');
                console.log("form updated!");
            };

            // Update Markdown every time content is modified
            $editor.bind('hallomodified', function (event, data) {
                updateForm(data.content);
            });
        });
    </script>
{% endmacro %}

{# ------------ #}
{# Select Input #}
{# ------------ #}
{% macro select(formModel, formProperty, values) %}
    {{ forms.rowWrapper(formModel, formProperty, forms.label(formModel, formProperty),
    forms.selectInput(formModel, formProperty, values), forms.hint(formModel, formProperty)) }}
{% endmacro %}

{% macro selectInput(formModel, formProperty, values) %}
    <select name = "{{ formModel.fieldIdentifier(formProperty) }}" class = "form-control">
        {% for value, text in values %}
            {% if (formModel[formProperty]) and (formModel[formProperty]) == value %}
            <option value = "{{ value }}" selected = "selected">
            {% else %}
                <option value = "{{ value }}">
            {% endif %}
            {{ text }}
            </option>
        {% endfor %}
    </select>
{% endmacro %}

{# ------------- #}
{# Submit Button #}
{# ------------- #}
{% macro submit(value, classes) %}
    <div class = "form-group">
        <div class = "col-sm-10 pull-right">
            <input type = "submit" value = "{{ value }}" class = "btn {{ classes }}"/>
        </div>
    </div>
{% endmacro %}


{# ---------- #}
{# CSRF Token #}
{# ---------- #}
{% macro csrf() %}
    <input type = "hidden" name = "_csrf" value = "{{ _csrf }}"/>
{% endmacro %}

{# ------------------ #}
{# Default Label Code #}
{# ------------------ #}
{% macro label(formModel, formProperty) %}
    {{ variableLabel(formModel, formProperty, 2) }}
{% endmacro %}

{# ------------------ #}
{# Generic Label Code #}
{# ------------------ #}
{% macro variableLabel(formModel, formProperty, labelCol) %}
    <label class = "col-sm-{{ labelCol }} control-label" for = "{{ formModel.fieldIdentifier(formProperty) }}">{{ formModel.getLabelText(formProperty) }}</label>
{% endmacro %}


{# ------------------ #}
{# Generic Hint Code #}
{# ------------------ #}
{% macro hint(formModel, formProperty) %}
    {% if (formModel.getHintText(formProperty)) %}
        <div class="form-control-hint">
            <span class="form-control-hint-text">{{ formModel.getHintText(formProperty) }}</span>
        </div>
    {% endif %}
{% endmacro %}

{# ------------------------ #}
{# Generic Form Row Wrapper #}
{# ------------------------ #}
{% macro rowWrapper(formModel, formProperty, labelHtml, inputHtml, hintHtml) %}
    {{ variableRowWrapper(formModel, formProperty, labelHtml, inputHtml, hintHtml, 2, 10)  }}
{% endmacro %}

{# ------------------------ #}
{# Generic Form Row Wrapper #}
{# ------------------------ #}
{% macro variableRowWrapper(formModel, formProperty, labelHtml, inputHtml, hintHtml, labelCol, inputCol) %}
    <div class = "form-group {% if formModel.getErrorsForField(formProperty).length %}has-feedback has-error{% endif %}">
        {{ labelHtml | safe }}
        <div class = "col-sm-{{ inputCol }}">
            {{ inputHtml | safe }}
            {% if formModel.getErrorsForField(formProperty).length %}
                <span class = "glyphicon glyphicon-remove form-control-feedback"
                      data-toggle = "popover"
                      data-original-title = "{{ formModel.getLabelText(formProperty) }}"
                      data-content = "{{ formModel.getErrorsForField(formProperty) }}"></span>
            {% endif %}
            {{ hintHtml | safe }}
        </div>

    </div>
{% endmacro %}