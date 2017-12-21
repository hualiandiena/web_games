import { Widget, createElement } from "../widgets.js";

export default function Community(props = {}) {
    var community = Object.create(Widget);

    community.render = function(){
        var template = "community";

        return createElement(template, {});
    };

    return community;
}