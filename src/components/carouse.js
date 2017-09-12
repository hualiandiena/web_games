import widget from "../widgets.js";

function Carouse(props = {}) {

    let carouse = Object.create(widget);

    carouse.render = function() {
        var template;

        let imgList = props.imgs.map((item) => {
            return '<img src="' + item + '" />'
        });

        return template;
    }

    return carouse;
}

export default Carouse;