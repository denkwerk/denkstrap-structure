{% extends templatePath + "styleguide.njs" %}

{% block pageTitle %}Pattern{% endblock %}

{% block content %}

{% for pattern in pattern %}

    <div id="#{{ pattern | patternName }}">
        {% include pattern %}
    </div>

{% endfor %}

{% endblock %}
