import { Widget, createElement } from "../widgets.js";

import "./Navigator.css";
import svg from "../resource/symbol-defs.svg";

export default function Navigator(props = {}) {
    var navigator = Object.create(Widget);

    navigator.state = {
        menuOpening: false,
        avatar: ""
    };

    navigator.openCloseMenu = function(ev) {
        this.setState((oState) => {
            return {
                menuOpening: !oState.menuOpening
            };
        });
    };

    navigator.widgetDidMount = function() {
        import('../resource/avatars/default.jpg').then((img) => {
            this.setState({
                avatar: img
            });
        });
    };

    navigator.render = function() {

        var template = '<nav class="app-nav {{open}}">' +
            '<ul class="flex-between">' +
                '<li>' +
                    '<label class="menu-icon" data-on-click="{{openCloseMenu}}">' +
                        '<span><span></span></span>' +
                        '<span><span></span></span>' +
                    '</label>' +
                    '<ul class="menu-content">' +
                        '<li><a>ENTERTAINMENT</a></li>' +
                        '<li><a>COMMUNITY</a></li>' +
                        '<li><a>待定</a></li>' +
                        '<li><a>待定2</a></li>' +
                    '</ul>' +
                '</li>' +
                '<li><a>' +
                    '<svg class="icon" width="1.25rem" height="1.25rem" fill="#F5FFFA">' +
                        '<use href="' + svg + '#pd-skeletor" />' +
                    '</svg>' +
                '</a></li>' +
                '<li>' +
                    '<a class="avatar">' +
                        '<img src="{{avatar}}" width="20" height="20" />' +
                        // '<span class="dropdown-caret"></span>' +
                    '</a>' +
                '</li>'+
            '</ul>' +
        '</nav>';

        return createElement(template, {
            avatar: this.state.avatar,
            openCloseMenu: this.openCloseMenu.bind(this),
            open: this.state.menuOpening ? "open" : ""
        });
    };

    return navigator;
}