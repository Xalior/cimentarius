{% extends 'layouts/base.swig' %}

{% block content %}
    <div id = "loginModal" class = "show" tabindex = "-1" role = "dialog">
        <div class = "modal-dialog">
            <div class = "modal-content">
                <div class = "modal-header">
                    <h1 class = "text-center">Login</h1>
                </div>
                <div class = "modal-body">
                    <form class = "form center-block" method="post" action="{{_adminLogin}}">
                        <div class = "form-group">
                            <input type="text" ng-model="username" class="form-control input-lg" placeholder="Username" name="username">
                        </div>
                        <div class = "form-group">
                            <input type="password" ng-model="password" class="form-control input-lg" placeholder="Password" name="password">
                        </div>
                        <div class = "form-group">
                            <button class = "btn btn-primary btn-lg btn-block">Sign In</button>
                        </div>
                        <input type = "hidden" name="_csrf" value="{{_csrf}}"/>
                    </form>
                </div>
            </div>
        </div>
    </div>
{% endblock %}
