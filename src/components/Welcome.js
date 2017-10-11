import { Widget, createElement } from "../widgets.js";

// import style from "./Welcome.css";

export default function Welcome(props = {}) {
    var welcome = Object.create(Widget);

    welcome.state = {
        action: 0
    };

    welcome.toggleToLogin = function(ev) {
        console.log(ev);
    };

    welcome.toggleToSignUp = function(ev) {
        console.log(3);
    };

    welcome.render = function() {
        var template =  '<div>' +
                            (this.state.action === 1 ? 
                            '{{login}}' : (this.state.action === 2 ?
                            '{{register}}' :
                            '<div>' +
                                '<svg></svg>' +
                                '<span>Paradise</span>' +
                            '</div>' +
                            '<div>' +
                                '<button data-on-click="{{toggleToLogin}}"><span>Login</span></button>' +
                                '<button data-on-click="{{toggleToSignUp}}"><span>SignUp</span></button>' +
                            '</div>')) +
                        '</div>';

        return createElement(template, {
            toggleToLogin: this.toggleToLogin.bind(this),
            toggleToSignUp: this.toggleToSignUp.bind(this)
        });
    };

    return welcome;
}