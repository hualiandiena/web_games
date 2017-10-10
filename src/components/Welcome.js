import { Widget, createElement } from "../widgets.js";

import style from "./Welcome.css";

export function Welcome(props = {}) {
	var welcome = Object.create(Widget);

	welcome.state = {
		action: 0
	};

	welcome.render = function() {
		var template =  '<div>' +
							this.state.action === 1 ? 
							'{{login}}' : this.state.action === 2 ?
							'{{register}}' :
							('<div></div>' +
							'<div>' +
								'<button type="button"></button>' +
								'<button type="button"></button>' +
							'</div>') +
						'</div>';

		return createElement(template, {

		});
	};

	return welcome;
}