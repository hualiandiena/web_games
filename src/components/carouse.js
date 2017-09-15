import Widget from "../widgets.js";

import "./Carouse.css";

function PicItem(props) {
    var { className = "", src = "" } = props;
    return '<li class="carouse-item {{' + className + '}}" >' +
                '<img src="' + src + '" />' +
            '</li>';
}

function Carouse(props = {}) {

    let carouse = Object.create(Widget);

    carouse.state = {
        picOffset: 0
    };

    carouse.widgetDidMount = function() {
        var fn = function() {
            if (this.state.picOffset < 5) {
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

        setInterval(fn.bind(this), 3000);
    };

    carouse.render = function() {
        var template;

        var imgList = props.imgs.map((item, key) => {
            var tmp = key + this.state.picOffset;
            return PicItem({
                src: item,
                className: "pic" + ( tmp > 4 ? tmp - 5 : tmp)
            });
        });

        template =  '<div class="carouse-wrapper">' +
                        '<ul class="carouse-content">' +
                            imgList.join("") +
                        '</ul>' +
                    '</div>';

        return template;
    }

    return carouse;
}

export default Carouse;