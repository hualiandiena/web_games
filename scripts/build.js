process.env.NODE_ENV = "production";
process.env.BABEL_ENV = "production";

var webpack = require("webpack");
var chalk = require("chalk");
var fs = require("fs-extra");

var config = require("./config/webpack.config.prod.js");
var paths = require("./config/paths");

// start build
new Promise((resolve, reject) => {
	fs.emptyDir(paths.appBuild);
	copyPublicFolder();
	return build();
})
	.then(({stats}) => {
		if (stats.compilation.errors.length) {
			let errors = stats.compilation.errors;
			console.log(chalk.red("Failed to compile."));
			errors.forEach(err => {
				console.log(err.message || err);
			});
			console.log();
		} else {
			console.log(chalk.green("Compiled successfully.\n"));
		}
	});


function build() {
	console.log("Creating an optimized production build...");

	let compiler = webpack(config);

	return new Promise((resolve, reject) => {
		compiler.run((err, stats) => {
			if (err) {
				return reject(err);
			}
			
			return resolve({
				stats
			});
		});
	});
}

function copyPublicFolder() {
	fs.copySync(paths.appPublic, paths.appBuild, {
		difference: true,
		filter: file => file !== paths.appHtml
	});
}