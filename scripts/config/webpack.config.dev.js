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
					autoprefixer({
                    	browsers: [
                        	'>1%',
                        	'last 4 versions',
                        	'Firefox ESR',
                        	'not ie < 9', // React doesn't support IE8 anyway
                      	],
                    	flexbox: 'no-2009',
                    })
				]
			}
		}),
		new webpack.HotModuleReplacementPlugin()
	]
}