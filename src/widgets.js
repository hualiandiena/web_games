const SING_TAG_REGEXP = /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/;
// const TAG_NAME_REGEXP = /<([\w:-]+)/;
const XHTML_TAG_REGEXP = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi;

const VARIABLE_START = "{{";
const VARIABLE_END = "}}";

// const DIFFTYPE = ["none", "attribute", "childList", "subtree"];

function buildFragment(html) {
    var nodes = [];
    var fragment = document.createDocumentFragment();
    var tmp = fragment.appendChild(document.createElement("div"));

    // 是否自动填充某些元素，如option、thead等

    // 将XHTML写法转变为标准HTML元素书写，利用innerHTML转成为DOM元素
    tmp.innerHTML = html.replace(/\{\{|\}\}/g, "").replace(XHTML_TAG_REGEXP, "<$1></$2>");
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
    _updateDOM: function(nHtml = this.render()) {
        var oHtml = this._stateCache[this._stateCache.length - 1].htmlCache;

        if (nHtml === oHtml) {
            return ;
        }

        this._nodeAttrsListeners.forEach((listener) => {
            if (listener.node) {

            }
        });

    },
    mount: function(ele, index) {
        if (ele && (ele.nodeType === 9 || ele.nodeType === 1)) {
            var html, nodes = [];

            // this._parentNode = ele;
            // this._DOMindex = index;
            html = this.render();
            if (html) {
                nodes = parseHTML(html);

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
    collectComponent: function(nodes) {
        if (nodes.length) {
            for (var index = 0, len = nodes.length; index < len; index++ ) {
                var node = nodes[index];

                this.collectAttrComponent(node);

                collectComponent(node.childNodes);
            }
        }
    },
    collectAttrComponent: function(node) {
        var attrs = node.attributes;
        attrs.forEach((attr) => {
            var value = attr.value;
            var startIndex = value.indexOf(VARIABLE_START);
            var endIndex = value.indexOf(VARIABLE_END);

            if (startIndex !== -1 && endIndex !== -1) {
                this._nodeAttrsListeners = {
                    node,
                    attr
                };
            }
        });
    },
    setState: function(state) {
        var variableType = typeof state;
        var tmpState, newState = {}, newHtml;
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
        newHtml = this.render();

        this._updateDOM(newHtml);
        this._stateCache.push({
            state: newState,
            htmlCache: newHtml
        });
    },
    render: function() {
        return "";
    },
    widgetDidMount: function() {

    }
};


exprot function createElement() {

}