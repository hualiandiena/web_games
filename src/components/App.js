import { Widget, createElement } from "../widgets.js";

import Welcome from "./Welcome.js";

// import style from "./App.css";

export default function App(props = {}) {
	var app = Object.create(Widget);

	app.state = {
		logined: true
	};

	app.render = function() {

		var welcome = !app.state.logined ? Welcome() : null;
		var template =  '<div>' +
							app.state.logined ? 
							('<nav>' +
								'<div></div>' +
								'<ul>' +
									'<li>' +
										'<a></i><span>Navigator</span></a>' +
									'</li>' +
									'<li>' +
										'<a><span>GAMES</span></a>' +
									'</li>' +
									'<li>' +
										'<a><span>User</span></a>' +
									'</li>' +
								'</ul>' +
								'<div></div>' +
							'</nav>' +
							'<main>' +
							'</main>') : '{{welcome}}' +
						'</div>';

		return createElement(template, {});
	};

	return app;
}