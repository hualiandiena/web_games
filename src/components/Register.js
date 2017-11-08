import { Widget, createElement } from "../widgets.js";

import "./Register.css";
import svg from "../resource/symbol-defs.svg";

export default function Register(props = {}) {
    var register = Object.create(Widget);

    register.render = function() {
        var { doSignUp } = props;
        var template = '<div>' +
                '<div class="register-logo-wrap">' +
                    '<div class="logo">' +
                        '<span></span>' +
                        '<span></span>' +
                        '<span></span>' +
                        '<span></span>' +
                        '<span></span>' +
                        '<span></span>' +
                    '</div>' +
                '</div>' + 
                '<form class="register-form">' +
                    '<div class="form-group">' +
                        '<label>' +
                            '<svg class="icon" width="1.25rem" height="1.25rem">' +
                                '<use href="' + svg + '#pd-user"/>' +
                            '</svg>' +
                        '</label>' +
                        '<input type="text" name="name" placeholder="Username" />' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label>' +
                            '<svg class="icon" width="1.25rem" height="1.25rem">' +
                                '<use href="' + svg + '#pd-envelope"/>' +
                            '</svg>' +
                        '</label>' +
                        '<input type="text" name="email" placeholder="Email" />' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label>' +
                            '<svg class="icon" width="1.25rem" height="1.25rem">' +
                                '<use href="' + svg + '#pd-locked"/>' +
                            '</svg>' +
                        '</label>' +
                        '<input type="password" name="pwd" placeholder="Password" />' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label>' +
                            '<svg class="icon" width="1.25rem" height="1.25rem">' +
                                '<use href="' + svg + '#pd-locked"/>' +
                            '</svg>' +
                        '</label>' +
                        '<input type="password" name="confirmPwd" placeholder="Confirm Password" />' +
                    '</div>' +
                    '<div class="form-group">' +
                        '<label>' +
                            '<svg class="icon" width="1.25rem" height="1.25rem">' +
                                '<use href="' + svg + '#pd-phone"/>' +
                            '</svg>' +
                        '</label>' +
                        '<input type="number" name="phone" placeholder="PhoneNumber" />' +
                    '</div>' +
                    '<div>' +
                        '<button type="submit" class="btn btn-sbumit" data-on-click="{{doSignUp}}">' +
                            '<span>Create Account</span>' +
                        '</button>' +
                    '</div>' +
                '</form>' +
            '</div>';

        return createElement(template, {
            doSignUp
        });
    };

    return register;
};