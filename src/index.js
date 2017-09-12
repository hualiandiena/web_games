import Carouse from "./components/Carouse.js";

import pic1 from "./resource/imgs/timg.jpg";

var rootEle = document.getElementById("root");

Carouse({
    imgs: [pic1]
}).mount(rootEle);