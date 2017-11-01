import { Widget, createElement } from "../widgets.js";

import Welcome from "./Welcome.js";

import "./App.css";

import svg from "../resource/symbol-defs.svg";

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

        var template = (app.state.logined ? 
                        '<div>' +
                            '<nav class="app-nav">' +
                                '<ul class="flex-between">' +
                                    '<li>' +
                                        '<label class="menu-icon">' +
                                            '<span></span><span></span>' +
                                        '</label>' +
                                    '</li>' +
                                    '<li><a>' +
                                        '<svg class="icon" width="1.25rem" height="1.25rem">' +
                                            '<use href="' + svg + '#pd-skeletor" />' +
                                        '</svg>' +
                                    '</a></li>' +
                                    '<li>' +
                                        '<span class="avatar">' +
                                            '<img src="{{avatar}}" width="20" height="20" />' +
                                            '<span class="dropdown-caret"></span>' +
                                        '</span>' +
                                    '</li>'+
                                '</ul>' +
                            '</nav>' +
                            '<main>' +
                            '</main>' +
                        '</div>' : 
                        '<div>{{welcome}}</div>');

        return createElement(template, {
            welcome,
            avatar: this.state.avatar
        });
    };

    return app;
}