import { Widget, createElement } from "../widgets.js";

import "./Navigator.css";
import svg from "../resource/symbol-defs.svg";

export default function Navigator(props = {}) {

    var navigator = Object.create(Widget);

    navigator.state = {
        menuOpening: false,
        searchView: false,
        avatar: ""
    };

    navigator.openCloseMenu = function(ev) {
        this.setState((oState) => {
            return {
                menuOpening: !oState.menuOpening,
                searchView: !oState.menuOpening && !oState.viewSearch
            };
        });
    };
    navigator.showSearch = function() {
        this.setState({
            searchView: true
        });
    }
    navigator.hideSearch = function() {
        this.setState({
            searchView: false
        });
    };

    navigator.widgetDidMount = function(node) {
        import('../resource/avatars/default.jpg').then((img) => {
            this.setState({
                avatar: img
            });
        });

        // add lisenter
        node.querySelector(".menu-content").addEventListener("animationend", (ev) => {
            var parent = ev.target.parentNode;
            if (this.state.searchView) {
                parent.className = parent.className.replace("search-show", "search-open");
            } else {
                parent.className = parent.className.replace(/\s*search\-hide\s*/, "");
            }
        });
    };

    navigator.render = function() {
        var searchState = "";
        if (this.state.menuOpening) {
            searchState = this.state.searchView ? "search-show" : "search-hide";
        }
        
        var template = '<nav class="app-nav {{open}}">' +
            '<ul class="flex-between">' +
                '<li>' +
                    '<label class="menu-icon" data-on-click="{{openCloseMenu}}">' +
                        '<span><span></span></span>' +
                        '<span><span></span></span>' +
                    '</label>' +
                    '<div class="menu-wrap {{searchState}}">' +
                        '<ul class="menu-content">' +
                            // '<label></label>' +
                            '<li class="menu-item"><a>ENTERTAINMENT</a></li>' +
                            '<li class="menu-item"><a>COMMUNITY</a></li>' +
                            '<li class="menu-item"><a>待定</a></li>' +
                            '<li class="menu-item"><a>待定2</a></li>' +
                            '<li class="menu-item"><a data-on-click="{{showSearch}}">' +
                                '<svg class="icon" width="1.25rem" height="1.25rem">' +
                                    '<use href="' + svg +'#pd-magnifier"/>' +
                                '</svg>' +
                                '<span>Quick Search</span>' +
                            '</a></li>' +
                        '</ul>' +
                        '<aside class="search-content">' +
                            '<form>' +
                                '<div class="form-group">' +
                                    '<button class="input-addon">' +
                                        '<svg class="icon" width="1.1875rem" height="1.1875rem">' +
                                            '<use href="' + svg + '#pd-magnifier" />' +
                                        '</svg>' +
                                    '</button>' +
                                    '<input type="text" placeholder="Quick Search" />' +
                                '</div>' +
                            '</form>' +
                            '<button>' +
                                '<span class="arrow"><span></span><span></span></span>' +
                            '</button>' +
                        '</aside>' +
                    '</div>' +
                '</li>' +
                '<li><a>' +
                    '<svg class="icon" width="1.625rem" height="1.625rem" fill="#F5FFFA">' +
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
            showSearch: this.showSearch.bind(this),
            open: this.state.menuOpening ? "open" : "",
            searchState
        });
    };

    return navigator;
}