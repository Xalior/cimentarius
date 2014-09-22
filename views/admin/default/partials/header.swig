<div id = "top-nav" class = "navbar navbar-default navbar-static-top">
    <div class = "container">
        <div class = "navbar-header">
            <button type = "button" class = "navbar-toggle" data-toggle = "collapse" data-target = ".navbar-collapse">
                <span class = "icon-toggle"></span>
            </button>
            <a class = "navbar-brand" href = "="{{_adminRoot}}/dashboard">Cimentarius!</a>
            <ul class = "nav navbar-nav navbar-left">
                {% include "./top-menu.swig" %}
            </ul>
        </div>
        <div class = "navbar-collapse collapse">
            <ul class = "nav navbar-nav navbar-right">
                <li class = "dropdown">
                    <a class = "dropdown-toggle" role = "button" data-toggle = "dropdown" href = "#">
                        <i class = "glyphicon glyphicon-user"></i>
                        {{ username }}
                        <span class = "caret"></span>
                    </a>
                    <ul id = "g-account-menu" class = "dropdown-menu" role = "menu">
                        <li>
                            <a href = "="{{_adminRoot}}/auth/account">My Account</a>
                        </li>
                    </ul>
                </li>
                <li>
                    <a href = "{{_adminRoot}}/auth/logout">
                        <i class = "glyphicon glyphicon-lock"></i>
                        Logout
                    </a>
                </li>
            </ul>
        </div>
    </div>
</div>