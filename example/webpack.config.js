const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		index: [path.resolve(__dirname, 'index.tsx')],
	},
	output: {
		filename: 'bundle.js',
	},
	resolve: {
		modules: [
			"node_modules",
			path.resolve(__dirname, "index.tsx")
		],
		extensions: [".tsx", ".ts",".js"]
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {},
					},
				],
			},
		],
	},
	devServer: {
		contentBase: __dirname,
		port: 3000,
	},
};