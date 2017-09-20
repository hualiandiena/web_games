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

function getChange(nodes, eleConfig, dealFn) {
    nodes.forEach((node, key) => {
        if (node.nodeType === 1) {
            let nAttrs = node.attributes;
            Array.prototype.forEach.call(nAttrs, (nAttr) => {
                var needReplace = false;
                var nVal = nAttr.value.replace(/\{\{(\w+)\}\}/g, function(str, name) {
                    needReplace = true;
                    dealFn(name, eleConfig[name], node, nAttr.name);
                    return eleConfig[name];
                });
                if (needReplace) {
                    node.setAttribute(nAttr.name, nVal);
                }
            });

            getChange(node.childNodes, eleConfig, dealFn);
        } else if (node.nodeType === 3) {
            let matches = /\{\{([^(?:{{)(?:}})]+)\}\}/.exec(node.nodeValue);
            if (matches) {
                let name = matches[1];
                let eleVariable = eleConfig[name];
                if (typeof eleVariable === "object") {
                    let parentNode = node.parentNode;
                    let htmlStr = parentNode.innerHTML;

                    dealFn(name, eleVariable, parentNode, "PARENT_CHILD");

                    if (Array.isArray(eleVariable)) {
                        let replaceText = eleVariable.reduce((text, item) => {
                            return text + item.template;
                        }, "");
                        parentNode.innerHTML = htmlStr.replace("{{" + name + "}}", replaceText);

                        for (let index = 0, len = eleVariable.length; index < len; index++) {
                            getChange([parentNode.childNodes[key + index]], 
                                eleVariable[index].config, dealFn);
                        }
                    } else {
                        parentNode.innerHTML = htmlStr.replace("{{" + name + "}}", eleVariable.template);
                        getChange(parentNode.childNodes, eleVariable.config, dealFn);
                    }
                } else {
                    dealFn(name, eleVariable, node);
                    node.nodeValue = eleVariable;
                }
            }
        }
    });
}

export var Widget = {
    _updateDOM: function(nEle = this.render()) {
        function cleanDirty(config) {
            for (let name in config) {
                if (config.hasOwnProperty(name)) {
                    if (typeof config[name] === "object") {
                        
                    } else {
                        let curVal = this.domLisenters[name].currentVal;
                        if (name in this.domLisenters && 
                                config[name] !== curVal) {

                            let lisenters = this.domLisenters[name].lisenters;
                            lisenters.forEach((info) => {
                                if (info.node) {
                                    switch (info.type) {
                                        case "TEXT": 
                                            node.nodeValue = config[name];
                                            break;
                                        case "ATTR":
                                            var nVal = node.getAttribute(info.nAttr).repalce(curVal, config[name]);
                                            node.setAttribute(info.nAttr, nVal);
                                            break;
                                        // no defaults
                                    }
                                }
                            });
                            this.domLisenters[name].currentVal = config[name];
                        }
                    }
                }
            }
        }
        // cleanDirty(nEle.config);
    },
    mount: function(ele, index) {
        if (ele && (ele.nodeType === 9 || ele.nodeType === 1)) {
            var nodes = [];

            var { template:html, config } = this.render();
            if (html) {
                this.domLisenters = {
                };
                nodes = parseHTML(html);
                getChange(nodes, config, this.addVaribleListener.bind(this));

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
                    state: dulState,
                    htmlCache: html
                }];
            }
        }
    },
    addVaribleListener: function(name, val, node, attr) {
        var type = attr === "PARENT_CHILD" ? "CHILD" : attr ? "ATTR" : "TEXT";
        if (this.domLisenters[name]) {
            if (type === "ATTR") {
                this.domLisenters[name].lisenters.push({
                    node,
                    type,
                    nAttr: attr
                });
            } else {
                this.domLisenters[name].lisenters.push({
                    node,
                    type
                });
            }
        } else {
            if (type === "ATTR") {
                this.domLisenters[name] = {
                    currentVal: val,
                    lisenters: [{
                        node,
                        nAttr: attr,
                        type
                    }]
                };
            } else {
                this.domLisenters[name] = {
                    currentVal: val,
                    lisenters: [{
                        node,
                        type
                    }]
                };
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
        // this._stateCache.push({
        //     state: newState,
        //     htmlCache: newHtml
        // });
    },
    render: function() {
        return "";
    },
    widgetDidMount: function() {

    }
};


export function createElement(template = "", config = {}) {
    var dom = {
        childs: []
    };
    var html = template.replace(TEMPLATE_REGEXP, (str, attrexp, attr, name) => {
        if (typeof config[name] === "object") {
            dom.childs.push(name);
            return config[name].reduce((childHTML, item) => {
                return childHTML + attrexp + item.html;
            }, "");
        }

        return attrexp + config[name];
    });
    return {
        template,
        html,
        config
    };
}