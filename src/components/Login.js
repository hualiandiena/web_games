import { Widget, createElement } from "../widgets.js";

import "./Login.css";

import svg from "../resource/symbol-defs.svg";

export default function Login(props = {}) {
    var login = Object.create(Widget);


    login.widgetDidMount = function(node) {

    };

    login.render = function() {
        var template =  '<div class="login-container">' +
            '<h2>Paradies</h2>' +
            '<form class="login-form">' +
                '<div class="form-group">' + 
                    '<label><svg class="icon">' +
                        '<use href="' + svg +'#pd-user" /></svg>' +
                    '</label>' +
                    '<input type="text" name="user" ' +
                        'placeholder="Username/Email" maxlength="16" />' +
                '</div>' +
                '<div class="form-group">' +
                    '<label>' +
                        '<svg class="icon">' +
                            '<use href="' + svg +'#pd-key" />' +
                        '</svg>' +
                    '</label>' +
                    '<input type="password" name="pwd" ' +
                        'placeholder="Password" maxlength="16" />'
                '</div>' +
                '<button><span>Login</span></button>' +
                '<p><a></a></p>'
            '</form>' +
            '<footer></footer>' +
        '</div>';

        return createElement(template, {});
    }

    return login;
}