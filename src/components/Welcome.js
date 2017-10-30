import { Widget, createElement } from "../widgets.js";

import Login from "./Login.js";
import "./Welcome.css";

export default function Welcome(props = {}) {

    var rootFontSize = parseInt(getComputedStyle(document.documentElement).fontSize, 10);
    var createBoom = function(root, x, y, fn = function(){}) {
        var dots, copy, backWrap;
        var template = root.querySelector("template");
        var div = template.content.querySelector("div.spread-container");
        var cRadius = 2.5;
        var dRadius = 1.5;
        var cScale = 3;
        var offset = cRadius * rootFontSize;
        div.style.left = x ? (x - offset) + "px" : "0px";
        div.style.top = y ? (y - offset) + "px" : "0px";

        dots = div.querySelectorAll(".dot");
        dots.forEach(function(dot) {
            var radius = parseInt(360 * Math.random(), 10);
            var start = 0.1 * Math.random();
            var final = 1.2 - 0.6 * Math.random();
            dot.style.setProperty("--finalX", 
                Math.cos(radius) * cScale * cRadius * (1 - start) * final + "rem");
            dot.style.setProperty("--finalY", 
                Math.sin(radius) * cScale * cRadius * (1 - start) * final + "rem");
            dot.style.left = Math.cos(radius) * cScale * cRadius * start + cRadius - dRadius + "rem";
            dot.style.top = Math.sin(radius) * cScale * cRadius * start + cRadius - dRadius + "rem";
            dot.firstElementChild.style.backgroundColor = "rgb(" +
                parseInt(255 * Math.random(), 10) + "," +
                parseInt(255 * Math.random(), 10) + "," +
                parseInt(255 * Math.random(), 10) + ")";
        });

        copy = document.importNode(div, true);
        backWrap = root.querySelector(".back-animate");
        fn(copy);
        backWrap.appendChild(copy);

        copy.addEventListener("animationend", removeAnimate);

        function removeAnimate(ev) {
            ev.target.removeEventListener("animationend", removeAnimate);
            backWrap.removeChild(copy);
        }
    };

    var welcome = Object.create(Widget);

    welcome.state = {
        action: 1
    };

    welcome.toggleToLogin = function(ev) {
        this.setState({
            action: 1
        });
    };

    welcome.toggleToSignUp = function(ev) {
        console.log(1);
        this.setState({
            action: 2
        });
    };

    welcome.widgetDidMount = function(node) {
        var wrap;
        if (node.className.includes("welcome-wrap")) {
            wrap = node;
        }else {
            wrap = node.querySelector(".welcome-wrap");
        }
        if (wrap) {
            if (window.ontouchstart) {
                wrap.ontouchstart = function(ev) {
                    var x = ev.touches[0].clientX;
                    var y = ev.touches[0].clientY;

                    createBoom(node, x, y);
                };
            } else {
                wrap.onmousedown = function(ev) {
                    var x = ev.clientX;
                    var y = ev.clientY;

                    createBoom(node, x, y);
                };
            }

            var iDot = node.querySelector(".i-dot");
            // createBoom(2.325 * rootFontSize, y, function(node) {}); 可设置动画的延迟实现
            setTimeout(function() {
                var boomY = parseInt(getComputedStyle(wrap).height, 10) / 2 - 3.75 * rootFontSize;
                createBoom(node, 2.35 * rootFontSize, boomY);
            }, 820);
            iDot.addEventListener("animationend", removeIDot);
        }

        function removeIDot(ev) {
            var target = ev.target;

            target.removeEventListener("animationend", removeIDot);
            node.querySelector(".welcome-content").style.display = "block";
            target.parentNode.removeChild(target);
        }
    };

    welcome.render = function() {
        var dots = "";
        for (let index = 0; index < 15; index++) {
            dots = dots + '<div class="dot"><div></div></div>';
        }
        var login = this.state.action === 1 ? Login({
            doLogin: props.doLogin,
            toggleToSignUp: this.toggleToSignUp.bind(this)
        }) : null;

        var template =  
            (this.state.action === 1 ? 
            '<div>{{login}}</div>' : (this.state.action === 2 ?
            '<div>{{register}}</div>' :
            '<div class="welcome-wrap">' +
                '<div class="i-dot"></div>' +
                '<div class="back-animate" width="100%" height="100%">' +
                '</div>' +
                '<div class="welcome-content">' +
                    '<svg width="18rem" height="8rem" viewbox="0 0 500 240">' +
                        '<g id="fills" transform="translate(20,0)">' +
                            '<path d="M10,55 ' + 
                                    'A45 45, 0, 1, 1, 55 100 ' + 
                                    'L55,80 ' + 
                                    'A25 25, 0, 1,0, 30 55 ' + 
                                    'L30,100 L10,100 Z" ' +
                                'fill="#206EFF" />' +
                            '<path d="M125,100 ' +
                                    'A45 45, 0, 1, 1, 170 55 ' +
                                    'L170,100 ' +
                                    'L150,100 ' +
                                    'L150,55 ' +
                                    'A25 25, 0, 1, 0, 125 80 Z" ' +
                                'fill="#FF324A" />' +
                            '<path d="M195,100 ' +
                                    'A45 45 0 1 1 240 55 ' +
                                    'L240,100 ' +
                                    'L220,100 ' +
                                    'L220,55 ' +
                                    'A25 25 0 1 0 195 80 Z" ' +
                                'fill="#206EFF" />' +
                            '<path d="M265,10 ' +
                                    'A45 45 0 1 0 310 55 ' +
                                    'L310,10 ' +
                                    'L290,10 ' +
                                    'L290,55 ' +
                                    'A25 25 0 1 1 265 30 Z" ' +
                                'fill="#FF324A" />' +
                            '<path d="M405,100 ' +
                                    'A45 45 0 1 1 450 55 ' +
                                    'L450,75 ' +
                                    'L405,75 ' +
                                    'L405,55 ' +
                                    'L430,55 ' +
                                    'A25 25 0 1 0 405 80 Z" ' +
                                'fill="#FF324A" />' +
                            '<path d="M150,55 ' +
                                    'A45 45 0 0 1 195 10 ' +
                                    'L195,30 ' +
                                    'A25 25 0 0 0 170 55 ' +
                                    'L170,100 L150,100 Z" ' +
                                'fill="#31FFA6" />' +
                            '<path d="M335,100 ' +
                                    'A45 45 0 0 0 380 55 ' +
                                    'A25 25 0 0 1 405 30 ' +
                                    'L405,10 ' +
                                    'A45 45 0 0 0 360 55 ' +
                                    'A25 25 0 0 1 335 80 Z" ' +
                                'fill="#206EFF" />' +
                            '<g fill="#31FFA6">' +
                                '<circle r="10" cx="300" cy="20" />' +
                                '<path d="M290,55 ' +
                                        'A45 45 0 0 0 335 100 ' +
                                        'L335,80 ' +
                                        'A25 25 0 0 1 310 55 ' +
                                        'L310,40 L290,40 Z" ' +
                                    'class="svg-i" />' +
                            '</g>' +
                        '</g>' +
                    '</svg>' +
                    '<div class="welcome-btn-group">' +
                        '<button data-on-click="{{toggleToLogin}}">' +
                            '<span>Login</span>' +
                        '</button>' +
                        '<button data-on-click="{{toggleToSignUp}}">' +
                            '<span>SignUp</span>' +
                        '</button>' +
                    '</div>' +
                '</div>' +
                '<template>' +
                    '<div class="spread-container">' +
                        // '<div class="circle"></div>' +
                        dots +
                    '</div>' +
                '</template>' +
            '</div>'));

        return createElement(template, {
            login,
            toggleToLogin: this.toggleToLogin.bind(this),
            toggleToSignUp: this.toggleToSignUp.bind(this)
        });
    };

    return welcome;
}