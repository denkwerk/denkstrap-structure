Module Code here

{% macro macro( condition = false ) %}

    <div class="example-module auto-init" data-module="modules/another-example-module/another-example-module"{% if condition %} data-condition="in-viewport"{% endif %}>
    Loading Another Example Module
</div>

{% endmacro %}
