var autoprefixer = require("autoprefixer");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MainfestPlugin = require("webpack-manifest-plugin");

var paths = require("./paths");

var env = process.env.NODE_ENV.trim();

module.exports = {
	devtool: "source-map",
	entry: {
		app: paths.appIndexJs
		// vendor: [
		// 	"lodash"
		// ]
	},
	output: {
		path: paths.appBuild,
		filename: "static/js/[name].[chunkhash:8].js",
		chunkFilename: "static/js/[name].[chunkhash:8].js",
		publicPath: "/"
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
				use: ["babel-loader"]
			},
			{
				test: /\.css$/,
				loader: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: [
						{
							loader: "css-loader",
							options: {
								importLoaders: 1,
								minimize: true,
								sourceMap: true
							}
						},
						{
							loader: "postcss-loader",
							options: {
								ident: "postcss",
								plugins: () => {
									require("postcss-flexbugs-fiexs"),
									autoprefixer({
			                            browsers: [
			                            	'>1%',
			                            	'last 4 versions',
			                            	'Firefox ESR',
			                            	'not ie < 9', // React doesn't support IE8 anyway
			                            ],
			                            flexbox: 'no-2009'
			                        })
								}
							}
						}
					]
				})
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
			tempalte: paths.appHtml,
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				keepClosingSlash: true,
				minifyJs: true,
				minifyCSS: true,
				minifyURLs: true
			}
		}),
		new webpack.DefinePlugin({
			__DEV__: env === "development",
			"process.env.NODE_ENV": JSON.stringify("production")
		}),
		new webpack.HashedModuleIdsPlugin(),
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: "vendor"
		// }),
		new webpack.optimize.CommonsChunkPlugin({
			name: "runtime"
		}),
		new webpack.optimize.UglifyJsPlugin({
			warnings: false,
			compress: {

			},
			output: {
				comments: false
			},
			sourceMap: {
				url: "inline"
			},
			ie8: false
		}),
		new ExtractTextPlugin("styles.css"),
		new MainfestPlugin({
			fileName: "asset-manifest.json"
		})
	]
};