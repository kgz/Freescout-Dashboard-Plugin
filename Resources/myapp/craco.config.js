const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const fs = require("fs");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
	optimization: {
		minimizer: [new TerserPlugin({
			extractComments: false,
		})],
	},
	devServer: {
		https: false,
	},
	webpack: {
		alias: {
			"react/jsx-dev-runtime.js": "react/jsx-dev-runtime",
			"react/jsx-runtime.js": "react/jsx-runtime"
		},
		configure: (webpackConfig, { env, paths }) => {
			// eslint-disable-next-line no-param-reassign
			webpackConfig.externals = [
				//{'lodash': 'lodash'}, // 24kb
			];
			webpackConfig.resolve.fallback = {
			};
			if (env === 'production') {
				webpackConfig.output = {
					filename: 'flg_jira.min.js',
					path: path.resolve(
						__dirname,
						"..",
						"flowlogic.main",
						"htdocs",
						"container",
						"globe",
						"addons",
						"jira",
						"assets_temp"
					),
				}
				webpackConfig.plugins = [
					new MiniCssExtractPlugin({
						filename: 'flg_jira.min.css',
					})
				];

			} else {
				webpackConfig.output = {
					pathinfo: true,
					filename: 'static/js/bundle.js',
					chunkFilename: 'static/js/[name].chunk.js',
					assetModuleFilename: 'static/media/[name].[hash][ext]',
					publicPath: 'http://' + process.env.HOST + ':' + process.env.PORT + '/',
					devtoolModuleFilenameTemplate: webpackConfig.output.devtoolModuleFilenameTemplate
				}
			}
			paths.appBuild = webpackConfig.output.path;
			return webpackConfig;
		},
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(s(a|c)ss)$/,
				 use: ['style-loader','css-loader', 'sass-loader'],
				 include: [
					path.resolve(__dirname, 'src', 'styles')
				 ],
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			
	
		]
	},

		

}