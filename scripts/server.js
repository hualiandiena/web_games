process.env.NODE_ENV = "development";

var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var chalk = require("chalk");
var fs = require("fs");

var webpackConfig = require("./config/webpack.config.dev.js");
var paths = require("./config/paths.js");

const compiler = webpack(webpackConfig);
const devServer = new WebpackDevServer(compiler, {
	contentBase: paths.appPublic,
	hot: true,
	publicPath: webpackConfig.output.publicPath,
	clientLogLevel: "none",
	quiet: true,
	open: true,
	openPage: "/index",
	historyApiFallback: true,
	watchOptions: {
		ignored: /node_modules/
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
});