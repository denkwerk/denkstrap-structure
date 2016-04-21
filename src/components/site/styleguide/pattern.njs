{% extends templatePath + "styleguide.njs" %}

{% block pageTitle %}Pattern{% endblock %}

{% block content %}

{% for pattern in pattern %}

    <h2>{{ pattern | patternName }}</h2>
    <div id="#{{ pattern | patternName }}">
        {% include pattern %}
    </div>

{% endfor %}

{% endblock %}
