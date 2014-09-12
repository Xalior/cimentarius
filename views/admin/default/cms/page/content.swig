<div class = "content-block-wrapper">
    {% for contentBlock in contentBlocks %}
        <div class = "panel panel-default">
            <div class = "panel-heading clearfix">
                <h4 class = "pull-left">{{ contentBlock.description }}</h4>

                {# Dropdown #}

                <div class = "dropdown pull-right content-block-add">
                    <a class = "btn btn-success" type = "button" data-toggle = "dropdown" data-target = "#">Options<span class = "caret"></span></a>
                    <ul class = "content-dropdown dropdown-menu" role = "menu">
                        {% if contentBlock.particleSpaceAvailable %}
                            {% set content_class = 'content-add' %}
                            {% set full_class = 'content-full hidden' %}
                        {% else %}
                            {% set content_class = 'content-add hidden' %}
                            {% set full_class = 'content-full' %}
                        {% endif %}
                        {% for contentType in contentBlock.contentTypes %}
                            <li class = "{{ content_class }}">
                                <a href = "/ole/cms/page/{{ currentPageId }}/content_block/{{ contentBlock.name }}/content_type/{{ contentType }}/particle/create">
                                    Add {{ contentType }}
                                </a>
                            </li>
                        {% endfor %}
                        <li class = "{{ full_class }}">
                            <a href = "#" onclick = "return false;">
                                Content Block Full
                            </a>
                        </li>
                        <li role = "presentation" class = "divider"></li>
                        <li>
                            <a class="preview-content-block" href = "/ole/cms/page/{{ currentPageId }}/content-block/preview/{{ contentBlock.name }}">
                                Preview Content Block
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div class = "panel-body">
                <ul class = "list-unstyled particle-list" data-block = "{{ contentBlock.name }}" data-limit = "{{ contentBlock.limit }}">
                    {% for particle in contentBlock.currentParticles %}
                        <li id = "particle-{{ particle.get('id') }}">
                            <div class = "particle form-control" data-particle-id = "{{ particle.get('id') }}">
                                <span class = "particle-type {{ particle.get('type') }}"></span>
                                <span class = "name">
                                    {{ particle.get('name') }}
                                </span>
                                <a class = "edit btn btn-danger pull-right btn-xs" href = "/ole/cms/particle/delete/{{ particle.get('id') }}">
                                    Delete
                                </a>
                                <a class = "edit btn btn-default pull-right btn-xs" href = "/ole/cms/particle/content_type/{{ particle.get('type') }}/update/{{ particle.get('id') }}">
                                    Edit
                                </a>
                                {% if (particle.get('enabled')) %}
                                    <a class = "edit btn btn-success pull-right btn-xs particle-enable-button" href = "/ole/cms/particle/{{ particle.get('id') }}/toggle-enabled">
                                        On
                                    </a>
                                {% else %}
                                    <a class = "edit btn btn-danger pull-right btn-xs particle-enable-button" href = "/ole/cms/particle/{{ particle.get('id') }}/toggle-enabled">
                                        Off
                                    </a>
                                {% endif %}
                            </div>
                        </li>
                    {% endfor %}
                </ul>
                <div class = "sortable-footer">
                    <a href = "/ole/cms/page/{{ currentPageId }}/reorder/{{ contentBlock.name }}" class = "btn btn-sm btn-success save-order">
                        Save New Order
                    </a>
                    <a href = "#" class = "btn btn-sm btn-danger revert">
                        Revert
                    </a>
                </div>
            </div>
        </div>
    {% endfor %}
    {# Orphan Particles #}
    {% if orphanParticles.length > 0 %}
        <div class = "panel panel-default">
            <div class = "panel-heading clearfix">
                <h4 class = "pull-left">Orphan Particles</h4>
            </div>
            <div class = "panel-body bg-danger">
                <ul class = "list-unstyled particle-list" data-block = "orphan" data-limit = "*">
                    {% for particle in orphanParticles %}
                        <li id = "particle-{{ particle.get('id') }}">
                            <div class = "particle form-control" data-particle-id = "{{ particle.get('id') }}">
                                <span class = "particle-type {{ particle.get('type') }}"></span>
                                        <span class = "name">
                                            {{ particle.get('name') }}
                                        </span>
                                <a class = "edit btn btn-danger pull-right btn-xs" href = "/ole/cms/particle/delete/{{ particle.get('id') }}">
                                    Delete
                                </a>
                                <a class = "edit btn btn-default pull-right btn-xs" href = "/ole/cms/particle/content_type/{{ particle.get('type') }}/update/{{ particle.get('id') }}">
                                    Edit
                                </a>
                            </div>
                        </li>
                    {% endfor %}
                </ul>
            </div>
        </div>
    {% endif %}
</div>
{# Modal #}
<div class = "modal fade content-modal" tabindex = "-1" role = "dialog" aria-hidden = "true" style = "display: none;"></div>
{# Script #}
<script type = "text/javascript">
    $(document).ready(function () {
        ole.particle.initSortable();
        ole.particle.initToggleEnable();
        ole.page.initContentBlockPreviews();
    });
</script>