import { createElement } from "../widgets.js";

export default function Entertainment() {
    var template = '<div>' + 
            '<ul>' + 
                '<li>Entertainment</li>' +
            '</ul>' +
        '</div>';
    return createElement(template, {});
}