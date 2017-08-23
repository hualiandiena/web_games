var webpack = require("webpack");
var devServer = require("webpack-dev-server");
var chalk = require("chalk");
var fs = require("fs");

var config = require("./config/webpack.config.dev.js");
var paths = require("./config/paths.js");

var compiler = webpack(config);
var server = devServer(compiler, {
	contentBase: paths.appPublic,
	hot: true,
	clientLogLevel: "none",
	historyApiFallback: true,
	open: true,
	openPage: "/index",
	publicPath: config.output.publicPath,
	queit: true,
	watchOptions: {
		ignored: /node_modules/
	}
});

server.use("/data/:json", (req, res) => {
	fs.readFile(paths.appDataJson + "/" + req.params.json + ".json", "utf-8", (err, data) => {
		if (err) {
			console.log(chalk.red(err));
		}
		res.json(data);
		res.end();
	});
});

server.listen(3001, (err, result) => {
	if (err) {
		console.log(chalk.red(err));
	}
	console.log(chalk.green("server start!!"));
});