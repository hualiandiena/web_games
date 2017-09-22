const SING_TAG_REGEXP = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
// const TAG_NAME_REGEXP = /<([\w:-]+)/;
const XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi;

const TEMPLATE_REGEXP = /(\s+([\w-]+)\s*="[\w-\s]*|>[^<>]*)\{\{([^{}]+)\}\}/g;

// const VARIABLE_START = "{{";
// const VARIABLE_END = "}}";

function buildFragment(html) {
    var nodes = [];
    var fragment = document.createDocumentFragment();
    var tmp = fragment.appendChild(document.createElement("div"));

    // 是否自动填充某些元素，如option、thead等

    // 将XHTML写法转变为标准HTML元素书写，利用innerHTML转成为DOM元素
    tmp.innerHTML = html.replace(XHTML_TAG_REGEXP, "<$1></$2>");
    nodes = nodes.concat(...tmp.childNodes);

    // clear
    tmp.textContent = "";
    fragment.textContent = "";
    fragment.innerHTML = ""; // actullty documentFragement hasn't innerHTML in chrome

    nodes.forEach((node) => {
        fragment.appendChild(node);
    });
    return fragment;
}

function parseHTML(html) {
    var parsed = SING_TAG_REGEXP.exec(html);
    if (parsed) {
        return [document.createElement(parsed[1])];
    }

    parsed = buildFragment(html);
    return parsed ? parsed.childNodes : [];
}

export var Widget = {
    _updateDOM: function(nEle = this.render()) {
        function cleanDirty(config, scope, scopeStr) {
            for (let name in config) {
                if (!config.hasOwnProperty(name)) {
                    continue ;
                }
                if (!(name in scope)) {
                    continue ;
                }


                // 未比较模板
                let curVal = scope[name].currentVal;
                if (typeof config[name] === "object") {
                    let childVariable = config[name];
                    if (Array.isArray(childVariable)) {
                        let tmpKeys = [];
                        let curNode = null;
                        childVariable.forEach((item, index) => {
                            if (item.config.key in scope[name].childs) {
                                tmpKeys.push(item.config.key);
                                curNode = scope[name].childs[item.config.key].node;

                                let tmpScope = scope[name].childs[item.config.key].scope; 
                                if (scopeStr) {
                                    tmpScopeStr = scopeStr + "." + name + "-" + item.config.key;
                                } else {
                                    tmpScopeStr = name + "-" + item.config.key;
                                }
                                cleanDirty(item.config, tmpScope, tmpScopeStr);
                            } else {

                                // add Node and note changes
                                let newNodes = parseHTML(item.template);
                                scope[name].childs[item.config.key] = {
                                    node: newNodes[0],
                                    scope: {}
                                };
                                this.getChange(newNodes, item.conifg, scopeStr);

                                let nextNode = curNode.nextSibling;
                                if (nextNode) {
                                    scope[name].node.inserBefore(newNodes[0], nexNode);
                                } else {
                                    scope[name].node.appendChild(newNodes[0]);
                                }
                            }
                        });

                        // del key and nodes
                        curVal.forEach((item) => {
                            if (!(item.config.key in tmpKeys)) {
                                scope[name].lisenters.forEach((lisenter) => {
                                    lisenter.node.removeChild(scope[name].childs[item.config.key].node);
                                });
                                delete scope[name].childs[item.config.key];
                            }
                        });
                    } else {
                        if () {}
                    }
                    return ;
                }

                if (name in scope && 
                        config[name] !== curVal) {

                    let lisenters = scope[name].lisenters;
                    lisenters.forEach((info) => {
                        if (!info.node) { 
                            return ;
                        }
                        switch (info.type) {
                            case "TEXT": 
                                info.node.nodeValue = config[name];
                                break;
                            case "ATTR":
                                var oVal = info.node.getAttribute(info.nAttr)
                                var nVal = oVal.replace(curVal, config[name]);
                                info.node.setAttribute(info.nAttr, nVal);
                                break;
                            // no defaults
                        }
                    });
                    scope[name].currentVal = config[name];
                }
            }
        }
        cleanDirty(nEle.config, this.domLisenters);
    },
    mount: function(ele, index) {
        if (ele && (ele.nodeType === 9 || ele.nodeType === 1)) {
            var nodes = [];

            var { template:html, config } = this.render();
            if (html) {
                this.domLisenters = {
                };
                nodes = parseHTML(html);
                this.getChange(nodes, config);
                console.log(this.domLisenters);

                this.element = [...nodes][0];

                // mount dom
                if (index && ele.children.length && 
                        index !== ele.children.length) {
                    nodes.forEach((node) => {
                        var referenceNode = ele.childNodes[index];
                        ele.insertBefore(node, referenceNode);
                    })
                } else {
                    nodes.forEach((node) => {
                        ele.appendChild(node);
                    });
                }
                this.widgetDidMount();
            }

            // init
            if (this.state) {
                let dulState = {}; 
                Object.assign(dulState, this.state);
                this._stateCache = [{
                    state: dulState
                }];
            }
        }
    },
    getChange: function(nodes, eleConfig, scope) {
        var dealFn = this.addVaribleListener.bind(this);

        function getDomChange(nodes, eleConfig, scope) {
            nodes.forEach((node, key) => {
                if (node.nodeType === 1) {
                    let nAttrs = node.attributes;
                    Array.prototype.forEach.call(nAttrs, (nAttr) => {
                        var needReplace = false;
                        var nVal = nAttr.value.replace(/\{\{(\w+)\}\}/g, function(str, name) {
                            needReplace = true;
                            dealFn(scope, name, eleConfig[name], node, nAttr.name);
                            return eleConfig[name];
                        });
                        if (needReplace) {
                            node.setAttribute(nAttr.name, nVal);
                        }
                    });

                    getDomChange(node.childNodes, eleConfig, scope);
                } else if (node.nodeType === 3) {
                    let matches = /\{\{([^(?:{{)(?:}})]+)\}\}/.exec(node.nodeValue);
                    if (!matches) {
                        return;
                    }
                    let name = matches[1];
                    let eleVariable = eleConfig[name];
                    if (typeof eleVariable === "object") {
                        let parentNode = node.parentNode;
                        let htmlStr = parentNode.innerHTML;

                        let variableNodes = [];
                        if (Array.isArray(eleVariable)) {
                            let replaceText = eleVariable.reduce((text, item) => {
                                return text + item.template;
                            }, "");
                            parentNode.innerHTML = htmlStr.replace("{{" + name + "}}", replaceText);

                            variableNodes = Array.prototype.slice.call(parentNode.childNodes, key , key + eleVariable.length);
                            dealFn(scope, name, eleVariable, parentNode, "PARENT_CHILD", variableNodes);

                            for (let index = 0, len = eleVariable.length; index < len; index++) {
                                let childKey = eleVariable[index].config.key;
                                let tmpScope = scope ? scope + "." + name + childKey : name + "-" + childKey;
                                getDomChange([parentNode.childNodes[key + index]], 
                                    eleVariable[index].config, tmpScope);
                            }
                        } else {
                            parentNode.innerHTML = htmlStr.replace("{{" + name + "}}", eleVariable.template);

                            variableNodes = [parentNode.childNodes[key]];
                            dealFn(scope, name, eleVariable, parentNode, "PARENT_CHILD", variableNodes);

                            let tmpScope = scope ? scope + "." + name : name;
                            getDomChange(parentNode.childNodes, eleVariable.config, tmpScope);
                        }
                    } else {
                        dealFn(scope, name, eleVariable, node);
                        node.nodeValue = eleVariable;
                    }
                }
            });
        }
        getDomChange(nodes, eleConfig, scope); 
    },
    addVaribleListener: function(scope, name, val, node, attr, childNodes) {
        var tmp = {
            node
        };
        if (attr === "PARENT_CHILD") {
            tmp.type = "PARENT_CHILD";
        } else if (attr) {
            tmp.type = "ATTR";
            tmp.nAttr = attr;
        } else {
            tmp.type = "TEXT";
        }

        if (scope) {
            let tmpScope = scope.split(".");
            let targetScope = tmpScope.reduce((scope, name) => {
                var index = name.indexOf("-");
                if (index > -1) {
                    let parentName = name.slice(0, index);
                    let key = name.slice(index + 1);
                    return scope[parentName].childs[key].scope;
                } else {
                    return scope[name].child.scope;
                }
            }, this.domLisenters);

            if (name in targetScope) {
                targetScope[name].lisenters.push(tmp);
            } else {
                targetScope[name] = {
                    currentVal: val,
                    lisenters: [tmp]
                };
                if (Array.isArray(val)) {
                    targetScope[name].childs = [];
                    targetScope[name].childs = val.reduce((obj, item, index) => {
                        obj[item.config.key] = {
                            node: childNodes[index],
                            scope: {}
                        };
                        return obj;
                    }, {});
                } else if (typeof val === "object") {
                    targetScope[name].child = {
                        node: childNodes[0],
                        scope: {}
                    };
                }
            }
        } else {

            if (name in this.domLisenters) {
                this.domLisenters[name].lisenters.push(tmp);
            } else {
                this.domLisenters[name] = {
                    currentVal: val,
                    lisenters: [tmp]
                };
                if (Array.isArray(val)) {
                    this.domLisenters[name].childs = [];
                    this.domLisenters[name].childs = val.reduce((obj, item, index) => {
                        obj[item.config.key] = {
                            node: childNodes[index],
                            scope: {}
                        };
                        return obj;
                    }, {});
                } else {
                    this.domLisenters[name].child = {
                        node: childNodes[0],
                        scope: {}
                    };
                }
            }
        }
    },
    setState: function(state) {
        var variableType = typeof state;
        var tmpState, newState = {}, nEle;
        if (variableType !== "object" && variableType !== "function") {
            throw new Error("state should be object or function.");
        }

        if (variableType === "function") {
            tmpState = state(this._stateCache[this._stateCache.length - 1].state);
            if (typeof newState !== "object") {
                throw new Error("state should return a object when state is a function");
            }
        } else {
            tmpState = state;
        }
        Object.assign(newState, this.state, tmpState);

        this.state = newState;
        nEle = this.render();

        this._updateDOM(nEle);
        this._stateCache.push({
            state: newState
        });
    },
    render: function() {
        return "";
    },
    widgetDidMount: function() {

    }
};


export function createElement(template = "", config = {}) {
    // var dom = {
    //     childs: []
    // };
    var html = template.replace(TEMPLATE_REGEXP, (str, attrexp, attr, name) => {
        if (typeof config[name] === "object") {
            // dom.childs.push(name);
            if (Array.isArray(config[name])) {
                return config[name].reduce((childHTML, item) => {
                    return childHTML + attrexp + item.html;
                }, "");
            } else {
                return config[name].html;
            }
        }

        return attrexp + config[name];
    });
    return {
        template,
        html,
        config
    };
}