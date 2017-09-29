import { Widget, createElement } from "../widgets.js";

import style from "./App.css";

export function App(props = {}) {
	var app = Object.create(Widget);

	app.render = function() {

		var template =  '<div>' +
							'<nav>' +
								'<div></div>' +
								'<ul>' +
									'<li>' +
										'<i class=""></i><span></span>' +
									'</li>' +
									'<li>' +
										'<i class=""></i><span>GAMES</span>' +
									'</li>' +
								'</ul>' +
								'<div></div>' +
							'</nav>' +
							'<main></main>' +
						'</div>';

		return createElement(template, {

		});
	};

	return app;
}