import { Widget, createElement } from "../widgets.js";

import Welcome from "./Welcome.js";

import "./App.css";

export default function App(props = {}) {
    var app = Object.create(Widget);

    app.state = {
        logined: false
    };

    app.widgetDidMount = function() {
        // var fn = function() {
        //     this.setState({
        //         logined: true
        //     });
        // };
        // setTimeout(fn.bind(this), 2000);
    };

    app.render = function() {
        var welcome = app.state.logined ? null : Welcome();
        var template = (app.state.logined ? 
                        '<div>' +
                            '<nav>' +
                                '<ul>' +
                                    '<li><span>Menu</span></li>' +
                                    '<li><span>Entertainment</span></li>' +
                                '</ul>' +
                            '</nav>' +
                            '<main>' +
                            '</main>' +
                        '</div>' : 
                        '<div>{{welcome}}</div>')

        return createElement(template, {
            welcome
        });
    };

    return app;
}