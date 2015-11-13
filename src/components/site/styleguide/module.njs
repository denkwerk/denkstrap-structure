{% extends templatePath + "styleguide.njs" %}

{% block pageTitle %}Module: {{ moduleName }}{% endblock %}

{% block content %}
    <h1>Module: {{ moduleName }}</h1>

    {% include moduleTemplate %}
{% endblock %}
