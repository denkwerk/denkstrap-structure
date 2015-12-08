{% extends templatePath + "styleguide.njs" %}

{% block pageTitle %}Module: {{ moduleName }}{% endblock %}

{% block content %}
    <h1>Module: {{ module | moduleName }}</h1>

    {% include template %}
{% endblock %}
