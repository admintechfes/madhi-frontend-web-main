const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs'); // to check if the file exists

module.exports = (env) => {
	// Get the root path (assuming your webpack config is in the root of your project!)
	const currentPath = path.join(__dirname);

	// Create the fallback path (the production .env)
	const basePath = currentPath + '/.env';

	// We're concatenating the environment name to our filename to specify the correct env file!
	const envPath = basePath + '.' + env.ENVIRONMENT;

	// Check if the file exists, otherwise fall back to the production .env
	const finalPath = fs.existsSync(envPath) ? envPath : basePath;

	// Set the path parameter in the dotenv config
	const fileEnv = dotenv.config({ path: finalPath }).parsed;

	// reduce it to a nice object, the same as before (but with the variables from the file)
	const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
		return prev;
	}, {});
	return {
		entry: './src/index.js',
		mode: 'development',
		devtool : 'inline-source-map',
		output: {
			path: path.resolve(__dirname, './dist'),
			filename: 'index.js',
			publicPath: '/',
		},
		target: 'web',
		devServer: {
			port: '3000',
			static: {
				directory: path.join(__dirname, 'public'),
			},
			open: true,
			hot: true,
			liveReload: true,
			historyApiFallback: true,
		},
		resolve: {
			extensions: ['.js', '.jsx', '.json'],
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader', 'postcss-loader'],
				},
				{
					test: /\.html$/,
					include: path.resolve(__dirname, 'public'), // Your path may be different.
					use: [
						{
							loader: 'html-loader',
						},
					],
				},
				{
					test: /\.(png|jpe?g|gif|svg)$/i,
					type: 'asset/resource', // To load images - background/import
				},
			],
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: path.join(__dirname, 'public', 'index.html'),
			}),
			new webpack.DefinePlugin(envKeys),
		],
	};
};
