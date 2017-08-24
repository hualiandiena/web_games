var autoprefixer = require("autoprefixer");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var paths = require("./paths");

var env = process.env.NODE_ENV.trim();

module.exports = {
	devtool: "cheap-module-source-map",
	entry: [
		paths.appIndexJs,
		"webpack-dev-server/client/index.js?http://localhost:3001/",
		"webpack/hot/dev-server"
	],
	output: {
		path: paths.appBuild,
		filename: "static/js/bundle.js",
		publicPath: "/"
	},
	resolve: {
		extensions: [".js", ".json"]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: "pre",
				include: paths.appSrc,
				use: ["eslint-loader"]
			},
			{
				test: /\.js$/,
				include: paths.appSrc,
				use: ["babel-loader"]
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 1
						}
					},
					"postcss-loader"
				]
			},
			{
				test: /\.json$/,
				use: ["json-loader"]
			},
			{
				test: /\.(gif|svg|otf|ttf|eot|woff(2)?)(\?.*)?$/,
				use: ["file-loader"]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
			template: paths.appHtml
		}),
		new webpack.DefinePlugin({
			__DEV__: env === "development"
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				postcss: [
					autoprefixer
				]
			}
		}),
		new webpack.HotModuleReplacementPlugin()
	]
}