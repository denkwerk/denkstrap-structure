{% extends templatePath + "styleguide.njs" %}

{% block pageTitle %}Overview{% endblock %}

{% block content %}
    <h1>Overview</h1>

    <h2>Modules</h2>

    <ul>
    {% for module in modules %}
        <li><a href="/styleguide/modules/{{ module }}/{{ module }}.html">{{ module }}</a></li>
    {% endfor %}
    </ul>

    <h2>Pattern</h2>

    <ul>
    {% for pattern in pattern %}
        <li><a href="/styleguide/pattern/pattern.html#{{ pattern }}">{{ pattern }}</a></li>
    {% endfor %}
    </ul>
{% endblock %}
