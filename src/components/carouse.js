import Widget from "../widgets.js";

import "./Carouse.css";

function PicItem(props) {
    var { className = "", src = "" } = props;
    return '<li class="carouse-item ' + className + '" ><img src="' + src + '" /></li>'
}

function Carouse(props = {}) {

    let carouse = Object.create(Widget);

    carouse.state = {
        picOffset: 0
    };
    carouse.widgetDidMount = function(node) {
        setTimeout(() => {
            console.log(1);
        }, 1000);
    };

    carouse.render = function() {
        var template;

        let imgList = props.imgs.map((item, key) => {
            return PicItem({
                src: item,
                className: "pic" + (key + this.state.picOffset)
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