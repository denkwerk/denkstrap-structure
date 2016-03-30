{% macro macro( condition = false ) %}

    <div class="example-module auto-init" data-module="modules/example-module/example-module"{% if condition %} data-condition="in-viewport"{% endif %}>
    Loading Example Module
</div>

{% endmacro %}
