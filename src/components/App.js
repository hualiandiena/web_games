import { Widget, createElement } from "../widgets.js";
import { DefaultRoute, Route } from "../routers/router.js";

import Welcome from "./Welcome.js";
import Navigator from "./Navigator.js";

import "./App.css";

// import svg from "../resource/symbol-defs.svg";

export default function App(props = {}) {
    var app = Object.create(Widget);

    app.state = {
        logined: true,
        avatar: ""
    };

    app.doLogin = function() {
        // 应在此处确定头像
        this.setState({
            logined: true
        });
    };

    app.doSignUp = function() {
        // this.setState({
        //     logined: true
        // });
        this.doLogin();
    };

    app.widgetDidMount = function() {
        // 根据当前登录用户动态加载头像
        if (this.state.logined) {
            import('../resource/avatars/default.jpg').then((img) => {
                this.setState({
                    avatar: img
                });
            });
        }
    };

    app.render = function() {
        var welcome = app.state.logined ? null : Welcome({
            doLogin: this.doLogin.bind(this),
            doSignUp: this.doSignUp.bind(this)
        });

        var navigator = app.state.logined  ? Navigator() : null;

        var homeRoute = DefaultRoute({
            path: "/home", 
            component: "Overview",
            resolve: function() {
                return import("./Overview.js");
            } 
        });
        var userRoute = Route({
            path: "/user", 
            component: "User", 
            resolve: function(){
                return import("./User.js");
            }
        });

        // welcome应该也使用route加载
        var template = (app.state.logined ? 
                        '<div class="app-wrap">' +
                            '{{navigator}}' +
                            '<main class="app-content">' +
                                '{{homeRoute}}' +
                                // '{{userRoute}}' +
                            '</main>' +
                        '</div>' : 
                        '<div>{{welcome}}</div>');

        return createElement(template, {
            welcome,
            navigator,
            avatar: this.state.avatar,
            homeRoute
        });
    };

    return app;
}