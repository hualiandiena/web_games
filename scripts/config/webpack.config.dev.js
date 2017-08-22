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
		filename: "[name].[chunkhash:8].js"
	}
}