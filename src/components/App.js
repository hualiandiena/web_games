import { Widget, createElement } from "../widgets.js";

import style from "./App.css";

function Welcome(props = {}) {
	var template =  '<div>' +
						'' +
					'</div>';

	return createElement(template, {});
}

export function App(props = {}) {
	var app = Object.create(Widget);

	app.state = {
		welcome: true
	};

	app.render = function() {

		var welcome = app.state.welcome ? Welcome() : null;
		var template =  '<div>' +
							'{{welcome}}' +
							'<nav>' +
								'<div></div>' +
								'<ul>' +
									'<li>' +
										'<i class=""></i><span>Navigator</span>' +
									'</li>' +
									'<li>' +
										'<i class=""></i><span>GAMES</span>' +
									'</li>' +
									'<li>' +
										'<i></i><span>User</span>' +
									'</li>' +
								'</ul>' +
								'<div></div>' +
							'</nav>' +
							'<main>' +
							'</main>' +
						'</div>';

		return createElement(template, {
			welcome
		});
	};

	return app;
}