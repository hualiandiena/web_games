import { Widget, createElement } from "../widgets.js";

import style from "./Login.css";

export default function Login(props = {}) {
	var login = Object.create(Widget);


	login.widgetDidMount = function(node) {

	};

	login.render = function() {
		var template =  '<div>' +
							'<h2></h2>' +
							'<form>' +
								'<div>' + 
									'<label>User</label>' +
									'<input type="text" name="user" />' +
								'</div>' +
								'<div>' +
									'<label>Password</label>' +
									'<input type="password" name="pwd" />'
								'</div>' +
								'<button></button>' +
								'<p><a></a></p>'
							'</form>' +
							'<footer></footer>' +
						'</div>';

		return createElement(template, {});
	}

	return login;
}