
/*
** widgets.js: a small framework that can help create a Component
*/


// 优化点：1.删除dom节点时，移除相关的监听

const SING_TAG_REGEXP = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
// const TAG_NAME_REGEXP = /<([\w:-]+)/;
const XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi;

const TEMPLATE_REGEXP = /(\s+([\w-]+)\s*="[\w-\s]*|>[^<>]*)\{\{([^{}]+)\}\}/g;
const TEMPLATE_NODE_VAR = /\{\{([^(?:{{)(?:}})]+)\}\}/;
const TEMPLATE_ATTR_VAR = /\{\{(\w+)\}\}/g;

// const eventTypes = ["click", "change", "mouseup", "mousedown", "mouseover", "mouseout"];

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

/*
** name: render
** return: a obj which is created by creatElement
** function: the result of this function affect how the component render in browser,
**           widget will run this function when component mount or update
*/

/*
** name: mount
** params: a dom element which is contain the component; the index of the element'childs
** function: mount component to dom
*/

/*
** name: setState
** params: new State, or a function return a new state
** function: update the component
*/

export var Widget = {
    _curTemplate: "",
    _element: null,
    _domLisenters: {},
    _stateCache: [],
    _updateDOM: function(nEle = this.render()) {
        // 模板改变未处理，嵌入元素未处理

        function cleanDirty(config, scope, scopeStr) {
            for (let name in config) {
                if (!config.hasOwnProperty(name)) {
                    continue ;
                }
                if (!(name in scope)) {
                    // 处理新增的节点变量
                    continue ;
                }

                // 未比较模板，模板的差异是直接dom元素替换
                if (typeof config[name] === "object") {
                    let childVar = config[name];
                    if (config[name].isPrototypeOf(Widget)) {
                        console.log("等待处理");
                        continue;
                    }

                    if (Array.isArray(childVar)) {
                        let tmpKeys = [];
                        let curNode = null;
                        let scopeChilds = scope[name].childs;
                        childVar.forEach((item, index) => {
                            var itemKey = item.config.key;
                            if (itemKey in scopeChilds) {
                                tmpKeys.push(itemKey);
                                curNode = scopeChilds[itemKey].node;

                                if (item.template !== scopeChilds[itemKey].template) {
                                    // this._updateTemplate(item, scopeChilds[itemKey]);
                                    scopeChilds[itemKey] = item.template;
                                }

                                let tmpScopeStr;
                                if (scopeStr) {
                                    tmpScopeStr = scopeStr + "." + name + "-" + itemKey;
                                } else {
                                    tmpScopeStr = name + "-" + itemKey;
                                }
                                cleanDirty(item.config, scopeChilds[itemKey].scope, tmpScopeStr);
                            } else {

                                // add Node and note changes
                                let newNodes = parseHTML(item.template);
                                scopeChilds[itemKey] = {
                                    template: item.template,
                                    node: newNodes[0],
                                    scope: {}
                                };
                                // this._getChange(newNodes, item.conifg, scopeStr);

                                let nextNode = curNode.nextSibling;
                                if (nextNode) {
                                    scope[name].node.inserBefore(newNodes[0], nextNode);
                                } else {
                                    scope[name].node.appendChild(newNodes[0]);
                                }
                            }
                        });

                        // del key and nodes
                        for (let key in scopeChilds) {
                            if (scopeChilds.hasOwnProperty(key) && !(key in tmpKeys)) {
                                scope[name].lisenters.forEach(lisenter => {
                                    lisenter.node.removeChild(scopeChilds[key].node);
                                });

                                delete scopeChilds[key];
                            }
                        }
                    } else {
                        let scopeChild = scope[name].child;
                        if (childVar.template !== scopeChild.template) {
                            this._updateTemplate(childVar, scopeChild);
                            scopeChild.template = childVar.template;
                        }

                        let tmpStr = scopeStr ? name : scopeStr + "." + name;
                        cleanDirty(childVar.config, scopeChild.scope, tmpStr);
                    }
                    continue ;
                }

                if (config[name] === null && scope[name]) {
                    // remove node
                    scope[name].lisenters.forEach(lisenter => {
                        lisenter.node.removeChild(scope[name].child.node);
                    });
                    delete scope[name];
                }

                let curVal = scope[name].currentVal;
                if (name in scope && config[name] !== curVal) {
                    let lisenters = scope[name].lisenters;
                    for (let i = 0, j = 0, len = lisenters.length; i < len; i++) {
                        let info = lisenters[i - j];
                        if (!info.node) {
                            // 移除该节点的监听
                            j++;
                            lisenters.splice(i - j, 1);
                            continue ;
                        }
                        switch (info.type) {
                            case "TEXT": 
                                info.node.nodeValue = config[name];
                                break;
                            case "ATTR":
                                var nVal;
                                var oVal = info.node.getAttribute(info.nAttr);
                                if (curVal) {
                                    nVal = oVal.replace(curVal, config[name]);
                                } else {
                                    nVal = oVal + config[name];
                                } 
                                info.node.setAttribute(info.nAttr, nVal);
                                break;
                            // no defaults
                        }
                    }
                    scope[name].currentVal = config[name];
                }
            }
        }

        if (this._curTemplate !== nEle.template) {
            this._updateTemplate(nEle, {
                template: this._curTemplate,
                node: this._element,
                scope: this._domLisenters
            });
            this._curTemplate = nEle.template;
        }
        cleanDirty(nEle.config, this._domLisenters);
    },
    _updateTemplate: function(nInfo, oInfo) {
        console.log("update template");
        // 目前只处理子节点替换的情况

        var { template:nTemplate, config } = nInfo;
        var { template: oTemplate, node: curNode, scope } = oInfo;
        var nElement = parseHTML(nTemplate)[0];
        var oElement = parseHTML(oTemplate)[0];

        function replaceTemplateNode(nElement, oElement, node) {
            if (nElement.nodeType !== oElement.nodeType ||
                (nElement.nodeType === 3 && nElement.nodeValue !== oElement.nodeValue) ||
                (nElement.nodeType === 1 && nElement.nodeName !== oElement.nodeName) ||
                nElement.childNodes.length !== oElement.childNodes.length
                ) {
                this._getChange([nElement], config);
                node.parentNode.replaceChild(nElement, node);

                return;
            }

            var offset = 0;
            nElement.childNodes.forEach((node, key) => {
                var oNode = oElement.childNodes[key];
                var name;
                if (oElement.nodeType === 3 && TEMPLATE_NODE_VAR.test(oElement.nodeValue)) {
                    name = oElement.nodeValue.slice(2, -2);
                    if (Array.isArray(config[name])) {
                        offset = offset + scope[name].childs.length;
                    }
                }
                replaceTemplateNode.call(this, node, oNode, node.childNodes[key + offset]);
            });
        }

        replaceTemplateNode.call(this, nElement, oElement, curNode);
    },
    _getChange: function(nodes, eleConfig, scope) {
        var dealFn = this._addVaribleListener.bind(this);

        function getDomChange(nodes, eleConfig, scope) {
            nodes.forEach((node, key) => {
                if (node.nodeType === 1) {
                    let nAttrs = node.attributes;
                    Array.prototype.forEach.call(nAttrs, (nAttr) => {
                        var needReplace = false;
                        var attrName =  nAttr.name;
                        var nVal = nAttr.value.replace(TEMPLATE_ATTR_VAR, function(str, name) {
                            needReplace = true;
                            if (attrName.slice(0, 8) === "data-on-") {
                                node["on" + attrName.slice(8)] = eleConfig[name];
                                return name;
                            } else {
                                dealFn(scope, name, eleConfig[name], node, attrName);
                                return eleConfig[name]; 
                            }
                        });
                        if (needReplace) {
                            node.setAttribute(attrName, nVal);
                        }
                    });

                    getDomChange(node.childNodes, eleConfig, scope);
                } else if (node.nodeType === 3) {
                    let matches = TEMPLATE_NODE_VAR.exec(node.nodeValue);
                    if (!matches) {
                        return;
                    }
                    let name = matches[1];
                    let eleVariable = eleConfig[name];
                    if (typeof eleVariable === "object") {
                        let parentNode = node.parentNode;
                        let htmlStr = parentNode.innerHTML;

                        if (Widget.isPrototypeOf(eleVariable)) {
                            parentNode.removeChild(node);
                            eleVariable.mount(parentNode, key);
                            return ;
                        }

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
                            getDomChange([parentNode.childNodes[key]], eleVariable.config, tmpScope);
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
    _addVaribleListener: function(scope, name, val, node, attr, childNodes) {
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

        var targetScope;
        if (scope) {
            let tmpScope = scope.split(".");
            targetScope = tmpScope.reduce((scope, name) => {
                var index = name.indexOf("-");
                if (index > -1) {
                    let parentName = name.slice(0, index);
                    let key = name.slice(index + 1);
                    return scope[parentName].childs[key].scope;
                } else {
                    return scope[name].child.scope;
                }
            }, this._domLisenters);
        } else {
            targetScope = this._domLisenters;
        }

        if (name in targetScope) {
            targetScope[name].lisenters.push(tmp);
        } else {
            if (attr === "PARENT_CHILD") {
                if (Array.isArray(val)) {
                    targetScope[name] = {
                        lisenters: [tmp],
                        childs: []
                    };
                    targetScope[name].childs = val.reduce((obj, item, index) => {
                        obj[item.config.key] = {
                            template: item.template,
                            node: childNodes[index],
                            scope: {}
                        };
                        return obj;
                    }, {});
                } else {
                    targetScope[name] = {
                        lisenters: [tmp],
                        child: {
                            template: val.template,
                            node: childNodes[0],
                            scope: {}
                        }
                    };
                }
            } else {
                targetScope[name] = {
                    currentVal: val,
                    lisenters: [tmp]
                };
            }
        }
    },
    mount: function(ele, index) {
        if (ele && (ele.nodeType === 9 || ele.nodeType === 1)) {
            var nodes = [];

            var { template:html, config } = this.render();
            if (html) {
                this._domLisenters = {};
                this._curTemplate = html;
                nodes = parseHTML(html);
                this._getChange(nodes, config);
                console.log(this._domLisenters);

                this._element = [...nodes][0];

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
                this.widgetDidMount(this._element);
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

        return attrexp + config[name] ? config[name] : "";
    });
    return {
        template,
        html,
        config
    };
}