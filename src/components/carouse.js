import { Widget, createElement } from "../widgets.js";

import "./Carouse.css";

function PicItem(props) {
    var { className = "", src = "", key } = props;
    var template =  '<li key="' + key + '" class="carouse-item {{className}}">' +
                        '<img src="{{src}}" />' +
                    '</li>';

    return createElement(template, {
        className,
        src,
        key
    });
}

function FooterItem(props) {
    var { className, key } = props;
    var template = '<li key="' + key + '"' +
                        'class="carouse-foot-item {{className}}"' +
                        'value="' + key + '"></li>';

    return createElement(template, {
        className,
        key
    });
}

function Test(props) {
    var aa = "dsftju";
    var template = "<div>{{aa}}</div>";
    return createElement(template, {
        aa
    });
}

function Carouse(props = {}) {

    let carouse = Object.create(Widget);

    carouse.state = {
        picOffset: 0
    };

    carouse.widgetDidMount = function(node) {
        var fn = function() {
            if (this.state.picOffset < 4) {
                this.setState((oldState) => {
                    return {
                        picOffset: ++oldState.picOffset
                    };
                });
            } else {
                this.setState({
                    picOffset: 0
                });
            }
        };

        var animatePic = setInterval(fn.bind(this), 3000);

        var clickFn = function(ev) {
            var target = ev.target || ev.srcElement;
            if (target.nodeName === "LI") {
                clearInterval(animatePic);
                this.setState({
                    picOffset: target.value
                });
                animatePic = setInterval(fn.bind(this), 3000);
            }
        };

        node.getElementsByClassName("carouse-footer")[0]
            .addEventListener("click", clickFn.bind(this));
    };

    carouse.render = function() {
        var template;
        var imgList = [],
            footList = [];
        for (let index = 0, len = props.imgs.length; index < len; index++) {
            let tmp = index + this.state.picOffset;
            imgList.push(PicItem({
                key: index,
                src: props.imgs[index],
                className: "pic" + ( tmp > 4 ? tmp - 5 : tmp)
            }));
            footList.push(FooterItem({
                key: index,
                className: this.state.picOffset === index ? "active" : ""
            }));
        }

        var text = "dsf";
        var test = Test();

        template =  '<div class="carouse-wrapper">' +
                        '<span>{{text}}</span>' +
                        '{{test}}' +
                        '<ol class="carouse-content">{{imgList}}</ol>' +
                        '<ol class="carouse-footer" type="1" start="0">' +
                            '{{footList}}' +
                        '</ol>' + 
                    '</div>';

        return createElement(template, {imgList, footList, text, test});
    };

    return carouse;
}

export default Carouse;