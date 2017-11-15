// 尚未建立连接，直接引用github上的另一个项目，目前就使用本地的方式

import createRouter from "../utils/browser.js";
import { Widget, createElement } from "../widgets.js";

var router = null;
var config = {};
var runFlag = false;

export default function Router(props = {}) {
    config = Object.assign({}, {
        html5mode: true
    }, props);

    router = createRouter();
    router.config(config);

}

export function Route(props = {}) {
    var route = Object.create(Widget);

    // private variables
    const { path, component: componentName, resolve } = props;
    var component;

    if (router === null) {
        throw Error("there is no router, you need create a router first.");
    }

    route.state = {
        loader: false,
        render: false
    };

    router.when(path, () => {
        if (!route.state.loader) {
            if (resolve && typeof resolve !== "function") {
                throw Error("resolve should be a function that return a promise.");
            } else if (resolve){
                resolve().then((module) => {
                    if (componentName in module) {
                        component = module[componentName];
                    } else {
                        component = module.default;
                    }

                    route.setState({
                        loader: true,
                        render: true
                    });
                });
            } else {
                // component = Function(componentName + "()");
            }
            
        } else if (!route.state.render) {
            route.setState({
                render: true
            });
        }
    });

    route.render = function() {
        var widget = this.state.render ? component(props) : null;
        var template = this.state.render ? '<div>{{widget}}</div>' : '';
        return createElement(template, {
            widget
        });
    };

    return route;
}

export function DefaultRoute(props = {}) {
    var route = Route(props);
    router.otherwise(props.path);
    router.run();
    return route;
}

export function Link(props) {
    var template;

    var { path, child } = props;

    var changeRoute = function() {
        router.routeTo(path);
    };

    if (config.html5mode) {
        template = '<a data-on-click="{{changeRoute}}">' + child + '</a>';
    } else {
        template = '<a href="#' + path + '">' + child + '</a>';
    }

    return createElement(template, {
        changeRoute
    });
}