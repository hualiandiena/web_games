import { Widget, createElement } from "../widgets.js";\

import "Register.css";

export function Register(props = {}) {
    var template = '<div>' +
            '<form>' +
                '<div>' +
                    '<label></label>' +
                    '<input type="text" name="user" />'
                '</div>' +
            '</form>' +
        '</div>';

    return createElement(template, {});
};