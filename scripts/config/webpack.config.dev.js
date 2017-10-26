var autoprefixer = require("autoprefixer");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");

var paths = require("./paths");

var env = process.env.NODE_ENV.trim();

module.exports = {
	devtool: "cheap-module-source-map",
	entry: [
		paths.appIndexJs,
		"webpack-dev-server/client/index.js?http://localhost:3002/",
		"webpack/hot/dev-server"
	],
	output: {
		path: paths.appBuild,
		filename: "static/js/bundle.js",
		publicPath: "/"
	},
	resolve: {
		modules: ["node_modules", paths.appNodeModules],
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
				test: /\.(bmp|(jpe?g)|png)$/,
				include: paths.appSrc,
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
				use: [
					{
						loader:"babel-loader",
						options: {
							// his is a feature of `babel-loader` for webpack (not Babel itself)
							// It enables caching results in ./node_modules/.cache/babel-loader/
              				// directory for faster rebuilds
							cacheDirectory: true,
						}
					}
				]
			},
			{
				test: /\.css$/,
				include: paths.appSrc,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: {
							importLoaders: 1
						}
					},
					{
						loader: "postcss-loader",
						options: {
							ident: "postcss",
							plugins: () => {
								autoprefixer({
		                            browsers: [
		                            	'>1%',
		                            	'last 4 versions',
		                            	'Firefox ESR',
		                            	'not ie < 9', // React doesn't support IE8 anyway
		                            ]
		                        })
							}
						}
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
			inject: true,
			template: paths.appHtml
		}),
		new webpack.DefinePlugin({
			__DEV__: env === "development"
		}),
		new webpack.HotModuleReplacementPlugin()
	]
}