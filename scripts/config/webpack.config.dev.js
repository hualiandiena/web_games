var autoprefixer = require("autoprefixer");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var paths = require("./paths");

var env = process.env.NODE_ENV.trim();

module.exports = {
	devtool: "cheap-module-source-map",
	entry: {
		app: [
			paths.appIndexJs,
			"webpack-dev-server/client?http://localhost:3001"
		]
	},
	output: {
		path: paths.appBuild,
		filename: "static/js/bundle.js",
		publicPath: "/"
	},
	resolve: {
		extension: [".js", ".json", ""]
	}
	module: {
		rules: [
			{
				test: /\.js$/,
				enforce: "pre",
				include: paths.appSrc,
				use: ["eslint-loader"]
			},
			{
				exclude: [
					/\.html$/,
					/\.js$/,
					/\.css$/,
					/\.json$/,
					/\.(gif|svg|otf|ttf|eot|woff(2)?)(\?.*)?$/
				],
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 10000,
							name: "static/media/[name].[hash:8].[ext]"
						}
					}
				]
			},
			{
				test: /\.js$/,
				include: paths.appSrc,
				use: ["babel-loader"]
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: "style-loader"
					},
					{
						loader: "css-loader",
						importLoaders: 1
					},
					{
						loader: "postcss-loader"
					}
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
			inject: true
		}),
		new webpack.LoaderOptionsPlugin({
			options: {
				postcss: [
					autoprefixer
				]
			}
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.definePlugin({
			__DEV__: env === "development"
		})
	]
}