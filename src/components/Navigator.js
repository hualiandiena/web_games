import { Widget, createElement } from "../widgets.js";

import "./Navigator.css";
import svg from "../resource/symbol-defs.svg";

export default function Navigator(props = {}) {

    var navigator = Object.create(Widget);

    navigator.state = {
        menuOpening: false,
        searchView: 0,
        avatar: ""
    };

    navigator.openCloseMenu = function(ev) {
        this.setState((oState) => {
            return {
                menuOpening: !oState.menuOpening,
                searchView: 0 
            };
        });
    };
    navigator.showSearch = function() {
        this.setState({
            searchView: 1
        });
    }
    navigator.hideSearch = function() {
        this.setState({
            searchView: 2
        });
    };

    navigator.widgetDidMount = function(node) {
        var self = this;
        import('../resource/avatars/default.jpg').then((img) => {
            self.setState({
                avatar: img
            });
        });

        // add lisenter
        node.querySelector(".menu-content").addEventListener("animationend", (ev) => {
            self.setState((oState) => {
                return {
                    searchView: oState.searchView === 1 ? 3 : 0
                };
            });
        });
    };

    navigator.render = function() {
        var searchState = "";

        switch (this.state.searchView) {
            case 0: 
                searchState = "";
                break;
            case 1:
                searchState = "search-show";
                break;
            case 2:
                searchState = "search-hide";
                break;
            case 3:
                searchState = "search-open";
                break;

            // no defaults
        }
        
        var template = '<nav class="app-nav {{open}} {{searchState}}">' +
            '<ul class="flex-between">' +
                '<li>' +
                    '<label class="menu-icon" data-on-click="{{openCloseMenu}}">' +
                        '<span><span></span></span>' +
                        '<span><span></span></span>' +
                    '</label>' +
                    '<div class="menu-wrap">' +
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
                            '<button class="search-close-btn btn-icon" data-on-click="{{hideSearch}}">' +
                                '<span class="arrow"><span></span><span></span></span>' +
                            '</button>' +
                        '</aside>' +
                    '</div>' +
                '</li>' +
                '<li><a class="nav-logo">' +
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
            hideSearch: this.hideSearch.bind(this),
            open: this.state.menuOpening ? "open" : "",
            searchState
        });
    };

    return navigator;
}