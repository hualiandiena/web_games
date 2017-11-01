import { Widget, createElement } from "../widgets.js";

import "./Login.css";

import svg from "../resource/symbol-defs.svg";

export default function Login(props = {}) {
    var login = Object.create(Widget);


    login.widgetDidMount = function(node) {

    };

    login.render = function() {
        var { doLogin, toggleToSignUp } = props;
        var template =  '<div class="login-container">' +
            '<h2>Welcome</h2>' +
            '<form class="login-form" novalidate>' +
                '<div class="login-logo-wrap">' +
                    '<div class="logo">' +
                        '<span></span>' +
                        '<span></span>' +
                        '<span></span>' +
                        '<span></span>' +
                        '<span></span>' +
                        '<span></span>' +
                    '</div>'+
                '</div>' +
                '<div class="form-group">' + 
                    '<label><svg class="icon" width="1.25rem" height="1.25rem">' +
                        '<use href="' + svg +'#pd-user" /></svg>' +
                    '</label>' +
                    '<input type="text" name="name" ' +
                        'placeholder="Username/Email" maxlength="32" />' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>' +
                        '<svg class="icon" width="1.25rem" height="1.25rem">' +
                            '<use href="' + svg +'#pd-locked" />' +
                        '</svg>' +
                    '</label>' +
                    '<input type="password" name="pwd" ' +
                        'placeholder="Password" maxlength="32" />' +
                '</div>' +
                '<div>' +
                    '<button type="submit" ' +
                        'class="btn-sbumit" ' +
                        'data-on-click="{{doLogin}}">Login</button>' +
                '</div>' +
            '</form>' +
            '<footer>' +
                '<a data-on-click="{{toggleToSignUp}}">Sign up</a>' +
                '<a>Forgot password?</a>' +
            '</footer>' +
        '</div>';

        return createElement(template, {
            doLogin,
            toggleToSignUp
        });
    }

    return login;
}