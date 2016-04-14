{% import 'modules' as modules %}
{% import 'patterns' as patterns %}

{% extends templatePath + "default.njs" %}

{% block pageTitle %}Example page{% endblock %}

{% block content %}
    <h1>This is a simple example of a nunjucks template</h1>

    <p style="height: 100vh;">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolorum repudiandae esse dolores quos minus perspiciatis laboriosam magni ipsum, optio sed quae aliquid sequi consectetur eaque vel, est ducimus similique illum. Debitis ea dolorum temporibus doloremque ratione, nesciunt aspernatur. Velit saepe dicta ipsa minus iusto odit ex, obcaecati temporibus, sint deserunt.
    </p>

    {{ modules.exampleModule.macro() }}
    {{ modules.exampleModule.macro(true) }}
    {{ modules.exampleModule.macro(true) }}
    {{ modules.exampleModule.macro(true) }}
    {{ modules.exampleModule.macro(true) }}
    {{ modules.exampleModule.macro(true) }}
    {{ modules.exampleModule.macro(true) }}
    {{ modules.exampleModule.macro(true) }}
    {{ modules.exampleModule.macro(true) }}
    {{ modules.exampleModule.macro(true) }}
    {{ modules.exampleModule.macro(true) }}
{% endblock %}
