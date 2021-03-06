process.env.NODE_ENV = "development";

var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var chalk = require("chalk");
var fs = require("fs");

var openBrowser = require("./utils/openBrowser.js");
var webpackConfig = require("./config/webpack.config.dev.js");
var paths = require("./config/paths.js");

const isInteractive = process.stdout.isTTY;

const compiler = webpack(webpackConfig);
const devServer = new WebpackDevServer(compiler, {
	contentBase: paths.appPublic,
	publicPath: webpackConfig.output.publicPath,
	inline: true,
	hot: true,
	quiet: false,
	historyApiFallback: true,
	watchOptions: {
		ignored: /node_modules/,
		poll: 1000
	}
});

devServer.use("/data/:json", (req, res) => {
	console.log(req.params.json);
	fs.readFile(paths.appDataJson + "/" + req.params.json + ".json", "utf-8", (err, data) => {
		if (err) {
			console.log(chalk.red(err));
		}
		res.json(data);
		res.end();
	});
});

devServer.listen(3002, "127.0.0.1", (err, result) => {
	if (err) {
		console.log(chalk.red(err));
	}
	console.log(chalk.green("server start!!"));
	console.log(isInteractive);
	if (isInteractive) {
		openBrowser("http://localhost:3002/");
	}
});