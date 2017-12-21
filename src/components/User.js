import { Widget, createElement } from "../widgets.js";

export default function User(props) {
    var user = Object.create(Widget);

    user.render = function() {
        var template = "aaa";

        return createElement(template, {
            
        });
    };
}