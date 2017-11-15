import App from "./components/App.js";
import Router from "./routers/router.js";

import "./resource/css/layout.css";
import "./resource/css/animations.css";

// import pic1 from "./resource/imgs/timg.jpg";
// import pic2 from "./resource/imgs/timg3.jpg";
// import pic3 from "./resource/imgs/timg4.jpg";
// import pic4 from "./resource/imgs/timg5.jpg";
// import pic5 from "./resource/imgs/timg6.jpg";

var rootEle = document.getElementById("root");

Router();
App().mount(rootEle);